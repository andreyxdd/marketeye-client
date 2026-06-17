import fs from 'fs';
import path from 'path';
import { AppMode } from '../../src/config/appMode';
import { getFlavorIconDir } from '../../src/config/buildFlavor';
import { MarketCode } from '../../src/config/market';

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

function patchElectronBuilderConfig(
  productName: string,
  market: MarketCode
): void {
  const pkgPath = path.join(ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as {
    build: {
      productName: string;
      artifactName: string;
    };
  };

  pkg.build.productName = productName;
  pkg.build.artifactName = `${productName}-\${version}-${market}-\${os}.\${ext}`;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  // eslint-disable-next-line no-console
  console.log(`prepared electron-builder productName=${productName}`);
}

const mode = normalizeMode(process.env.MARKETEYE_MODE);
const market = normalizeMarket(process.env.MARKETEYE_MARKET);
const productName = process.env.MARKETEYE_PRODUCT_NAME?.trim();
if (!productName) {
  throw new Error('MARKETEYE_PRODUCT_NAME is required for packaging');
}

copyFlavorIcons(mode, market);
patchElectronBuilderConfig(productName, market);
