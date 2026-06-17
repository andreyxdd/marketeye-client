import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import {
  MICRO_TO_PRIMARY,
  MICRO_US_PRIMARY,
  US_PRIMARY,
} from '../../src/config/palette';

const ROOT = path.join(__dirname, '../..');
const ASSETS = path.join(ROOT, 'assets');
const BASE_ICON_PNG = path.join(ASSETS, 'icons/512x512.png');
const BASE_ICON_SVG = path.join(ASSETS, 'icon.svg');
const FLAVORS_DIR = path.join(ASSETS, 'flavors');

type FlavorSpec = {
  dir: string;
  accent: string | null;
};

const FLAVORS: FlavorSpec[] = [
  { dir: 'standard', accent: null },
  { dir: 'micro-us', accent: MICRO_US_PRIMARY },
  { dir: 'micro-to', accent: MICRO_TO_PRIMARY },
];

const ICON_SIZES = [16, 24, 32, 48, 64, 96, 128, 256, 512];

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace('#', '');
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

async function compositeAccent(accent: string): Promise<Buffer> {
  const size = 512;
  const circleDiameter = Math.round(size * 0.42);
  const left = Math.round((size - circleDiameter) / 2);
  const top = Math.round((size - circleDiameter) / 2);
  const { r, g, b } = hexToRgb(accent);

  const circle = await sharp({
    create: {
      width: circleDiameter,
      height: circleDiameter,
      channels: 4,
      background: { r, g, b, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  const circleMask = await sharp(circle)
    .resize(circleDiameter, circleDiameter)
    .composite([
      {
        input: Buffer.from(
          `<svg width="${circleDiameter}" height="${circleDiameter}">
            <circle cx="${circleDiameter / 2}" cy="${circleDiameter / 2}" r="${
            circleDiameter / 2
          }" fill="white"/>
          </svg>`
        ),
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer();

  const baseIcon = await loadBaseIconBuffer();
  return sharp(baseIcon)
    .resize(size, size)
    .composite([{ input: circleMask, left, top, blend: 'over' }])
    .png()
    .toBuffer();
}

async function loadBaseIconBuffer(): Promise<Buffer> {
  if (fs.existsSync(BASE_ICON_PNG)) {
    return fs.promises.readFile(BASE_ICON_PNG);
  }

  if (!fs.existsSync(BASE_ICON_SVG)) {
    throw new Error(
      `missing base icon: expected ${BASE_ICON_PNG} or ${BASE_ICON_SVG}`
    );
  }

  return sharp(BASE_ICON_SVG).resize(512, 512).png().toBuffer();
}

async function ensureBaseAssets(): Promise<void> {
  const pngBuffer = await loadBaseIconBuffer();

  fs.mkdirSync(path.join(ASSETS, 'icons'), { recursive: true });
  if (!fs.existsSync(BASE_ICON_PNG)) {
    await fs.promises.writeFile(BASE_ICON_PNG, pngBuffer);
  }

  const rootPng = path.join(ASSETS, 'icon.png');
  if (!fs.existsSync(rootPng)) {
    await fs.promises.writeFile(rootPng, pngBuffer);
  }

  const rootIco = path.join(ASSETS, 'icon.ico');
  if (!fs.existsSync(rootIco)) {
    const icoSources = await Promise.all(
      ICON_SIZES.map(async (iconSize) =>
        sharp(pngBuffer).resize(iconSize, iconSize).png().toBuffer()
      )
    );
    await fs.promises.writeFile(rootIco, await pngToIco(icoSources));
  }
}

async function writeFlavorIcons({ dir, accent }: FlavorSpec): Promise<void> {
  const outDir = path.join(FLAVORS_DIR, dir);
  fs.mkdirSync(outDir, { recursive: true });

  const pngPath = path.join(outDir, 'icon.png');
  const icoPath = path.join(outDir, 'icon.ico');

  if (accent === null) {
    for (const filename of ['icon.png', 'icon.ico', 'icon.icns']) {
      const source = path.join(ASSETS, filename);
      if (!fs.existsSync(source)) {
        if (filename === 'icon.icns') {
          continue;
        }
        throw new Error(`missing standard asset ${source}`);
      }
      await fs.promises.copyFile(source, path.join(outDir, filename));
    }
    // eslint-disable-next-line no-console
    console.log(`generated ${dir} icons -> ${outDir}`);
    return;
  }

  const pngBuffer = await compositeAccent(accent);
  await fs.promises.writeFile(pngPath, pngBuffer);

  const icoSources = await Promise.all(
    ICON_SIZES.map(async (iconSize) => {
      return sharp(pngBuffer).resize(iconSize, iconSize).png().toBuffer();
    })
  );

  const icoBuffer = await pngToIco(icoSources);
  await fs.promises.writeFile(icoPath, icoBuffer);

  const standardIcns = path.join(ASSETS, 'icon.icns');
  const flavorIcns = path.join(outDir, 'icon.icns');
  if (fs.existsSync(standardIcns)) {
    await fs.promises.copyFile(standardIcns, flavorIcns);
  }

  // eslint-disable-next-line no-console
  console.log(`generated ${dir} icons -> ${outDir}`);
}

async function main(): Promise<void> {
  await ensureBaseAssets();

  fs.mkdirSync(FLAVORS_DIR, { recursive: true });

  for (const flavor of FLAVORS) {
    await writeFlavorIcons(flavor);
  }

  // eslint-disable-next-line no-console
  console.log(`accent reference US primary: ${US_PRIMARY}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
