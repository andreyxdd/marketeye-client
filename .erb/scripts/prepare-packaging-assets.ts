import fs from 'fs';
import path from 'path';
import { AppMode } from '../../src/config/appMode';
import { getFlavorIconDir, getFlavorManifestEntry } from '../../src/config/buildFlavor';
import { MarketCode } from '../../src/config/market';
import { FlavorManifestEntry } from '../../src/config/flavorManifest';

const ROOT = path.join(__dirname, '../..');
const ASSETS = path.join(ROOT, 'assets');

function normalizeMode(raw: string | undefined): AppMode {
  const mode = (raw ?? 'standard').toLowerCase();
  if (mode !== 'standard' && mode !== 'micro') {
    throw new Error(`unsupported MARKETEYE_MODE: ${raw ?? '(empty)'}`);
  }
  return mode as AppMode;
}

function normalizeMarket(raw: string | undefined): MarketCode {
  const code = (raw ?? 'US').toUpperCase();
  if (code !== 'US' && code !== 'TO') {
    throw new Error(`unsupported MARKETEYE_MARKET: ${raw ?? '(empty)'}`);
  }
  return code as MarketCode;
}

function copyFlavorIcons(mode: AppMode, market: MarketCode): void {
  const flavorDir = path.join(ASSETS, getFlavorIconDir(mode, market));

  for (const filename of ['icon.png', 'icon.ico', 'icon.icns']) {
    const source = path.join(flavorDir, filename);
    const target = path.join(ASSETS, filename);

    if (!fs.existsSync(source)) {
      if (filename === 'icon.icns') {
        continue;
      }
      throw new Error(
        `missing flavor asset ${source}. Run npm run generate:icons first.`
      );
    }

    fs.copyFileSync(source, target);
  }

  // eslint-disable-next-line no-console
  console.log(
    `prepared packaging icons from ${path.relative(ROOT, flavorDir)}`
  );
}

function syncReleaseAppVersion(): void {
  const rootPkgPath = path.join(ROOT, 'package.json');
  const releasePkgPath = path.join(ROOT, 'release/app/package.json');
  const releaseLockPath = path.join(ROOT, 'release/app/package-lock.json');

  const rootVersion = (
    JSON.parse(fs.readFileSync(rootPkgPath, 'utf8')) as { version: string }
  ).version;

  const releasePkg = JSON.parse(
    fs.readFileSync(releasePkgPath, 'utf8')
  ) as { version: string };
  if (releasePkg.version === rootVersion) {
    return;
  }

  releasePkg.version = rootVersion;
  fs.writeFileSync(releasePkgPath, `${JSON.stringify(releasePkg, null, 2)}\n`);

  if (fs.existsSync(releaseLockPath)) {
    const releaseLock = JSON.parse(
      fs.readFileSync(releaseLockPath, 'utf8')
    ) as {
      version: string;
      packages: Record<string, { version?: string }>;
    };
    releaseLock.version = rootVersion;
    if (releaseLock.packages['']) {
      releaseLock.packages[''].version = rootVersion;
    }
    fs.writeFileSync(
      releaseLockPath,
      `${JSON.stringify(releaseLock, null, 2)}\n`
    );
  }

  // eslint-disable-next-line no-console
  console.log(`synced release/app version to ${rootVersion}`);
}

function patchReleaseAppName(releaseAppName: string): void {
  const releasePkgPath = path.join(ROOT, 'release/app/package.json');
  const releasePkg = JSON.parse(
    fs.readFileSync(releasePkgPath, 'utf8')
  ) as { name: string; version: string };

  if (releasePkg.name === releaseAppName) {
    return;
  }

  releasePkg.name = releaseAppName;
  fs.writeFileSync(releasePkgPath, `${JSON.stringify(releasePkg, null, 2)}\n`);

  // eslint-disable-next-line no-console
  console.log(`prepared release/app name=${releaseAppName}`);
}

function patchElectronBuilderConfig(entry: FlavorManifestEntry): void {
  const pkgPath = path.join(ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as {
    build: {
      productName: string;
      artifactName: string;
      appId?: string;
      win?: {
        executableName?: string;
        target?: string[];
      };
    };
  };

  const { productName, market } = entry;
  pkg.build.productName = productName;
  pkg.build.artifactName = `${productName}-\${version}-${market}-\${os}.\${ext}`;
  pkg.build.appId = entry.appId;

  if (!pkg.build.win) {
    pkg.build.win = { target: ['nsis'] };
  }
  pkg.build.win.executableName = entry.executableName;

  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  // eslint-disable-next-line no-console
  console.log(
    `prepared electron-builder productName=${productName} appId=${entry.appId} executableName=${entry.executableName}`
  );
}

const mode = normalizeMode(process.env.MARKETEYE_MODE);
const market = normalizeMarket(process.env.MARKETEYE_MARKET);
const manifestEntry = getFlavorManifestEntry(mode, market);
const productName = process.env.MARKETEYE_PRODUCT_NAME?.trim();
if (!productName) {
  throw new Error('MARKETEYE_PRODUCT_NAME is required for packaging');
}
if (productName !== manifestEntry.productName) {
  throw new Error(
    `MARKETEYE_PRODUCT_NAME "${productName}" does not match manifest productName "${manifestEntry.productName}" for mode=${mode} market=${market}`
  );
}

syncReleaseAppVersion();
copyFlavorIcons(mode, market);
patchReleaseAppName(manifestEntry.releaseAppName);
patchElectronBuilderConfig(manifestEntry);
