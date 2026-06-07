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

const mode = normalizeMode(process.env.MARKETEYE_MODE);
const market = normalizeMarket(process.env.MARKETEYE_MARKET);
copyFlavorIcons(mode, market);
