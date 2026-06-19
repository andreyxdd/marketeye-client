import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '../..');
const BUILD_DIR = path.join(ROOT, 'release/build');

type CollectArgs = {
  releaseAppName: string;
  tag: string;
  repo: string;
};

function parseArgs(): CollectArgs {
  const args = process.argv.slice(2);
  let releaseAppName = '';
  let tag = '';
  let repo = 'andreyxdd/marketeye-client';

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--release-app-name') {
      releaseAppName = args[i + 1] ?? '';
      i += 1;
    } else if (arg === '--tag') {
      tag = args[i + 1] ?? '';
      i += 1;
    } else if (arg === '--repo') {
      repo = args[i + 1] ?? repo;
      i += 1;
    }
  }

  if (!releaseAppName) {
    throw new Error('--release-app-name is required');
  }
  if (!tag) {
    throw new Error('--tag is required');
  }

  return { releaseAppName, tag, repo };
}

function rewriteLatestYml(content: string, releaseUrl: string): string {
  const lines = content.split(/\r?\n/);
  let inFilesSection = false;

  return lines
    .map((line) => {
      if (line.startsWith('files:')) {
        inFilesSection = true;
        return line;
      }
      if (inFilesSection && /^\s{2}-\s+url:/.test(line)) {
        return line.replace(/url:\s*.+$/, `url: ${releaseUrl}`);
      }
      if (line.startsWith('path:')) {
        inFilesSection = false;
        return `path: ${releaseUrl}`;
      }
      return line;
    })
    .join('\n');
}

function normalizeInstallerName(name: string): string {
  return name.replace(/[\s-]+/g, '').toLowerCase();
}

function resolveInstallerPath(installerName: string): { installerPath: string; fileName: string } {
  const directPath = path.join(BUILD_DIR, installerName);
  if (fs.existsSync(directPath)) {
    return { installerPath: directPath, fileName: installerName };
  }

  const exes = fs
    .readdirSync(BUILD_DIR)
    .filter((name) => name.toLowerCase().endsWith('.exe'));
  if (exes.length === 0) {
    throw new Error(`no .exe found in ${BUILD_DIR} (expected ${installerName})`);
  }

  const normalizedTarget = normalizeInstallerName(installerName);
  const matched =
    exes.find((name) => normalizeInstallerName(name) === normalizedTarget) ??
    exes[0];

  return {
    installerPath: path.join(BUILD_DIR, matched),
    fileName: matched,
  };
}

function collectUpdateArtifacts({
  releaseAppName,
  tag,
  repo,
}: CollectArgs): string {
  const latestYmlPath = path.join(BUILD_DIR, 'latest.yml');
  if (!fs.existsSync(latestYmlPath)) {
    throw new Error(`missing ${latestYmlPath}`);
  }

  const latestYml = fs.readFileSync(latestYmlPath, 'utf8');
  const pathMatch = latestYml.match(/^path:\s*(.+)$/m);
  const installerName = pathMatch?.[1]?.trim();
  if (!installerName) {
    throw new Error('could not parse installer path from latest.yml');
  }

  const { installerPath, fileName } = resolveInstallerPath(installerName);

  const blockmapPath = `${installerPath}.blockmap`;
  if (!fs.existsSync(blockmapPath)) {
    throw new Error(`missing blockmap ${blockmapPath}`);
  }

  const releaseUrl = `https://github.com/${repo}/releases/download/${tag}/${encodeURIComponent(
    fileName
  )}`;
  const rewrittenYml = rewriteLatestYml(latestYml, releaseUrl);

  const outDir = path.join(ROOT, 'updates', releaseAppName);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'latest.yml');
  fs.writeFileSync(outPath, `${rewrittenYml.trim()}\n`);

  // eslint-disable-next-line no-console
  console.log(`wrote ${path.relative(ROOT, outPath)} with path=${releaseUrl}`);
  return outPath;
}

if (require.main === module) {
  collectUpdateArtifacts(parseArgs());
}

export { collectUpdateArtifacts, normalizeInstallerName, rewriteLatestYml };
