import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import {
  BuildFlavor,
  FlavorManifestEntry,
  FlavorShape,
  FLAVOR_MANIFEST,
} from '../../src/config/flavorManifest';

const ROOT = path.join(__dirname, '../..');
const ASSETS = path.join(ROOT, 'assets');
const FLAVORS_DIR = path.join(ASSETS, 'flavors');

// NSIS rejects oversized ICO entries (512px via png-to-ico breaks makensis).
const ICO_SIZES = [16, 32, 48, 64, 128, 256];
const ICON_SIZE = 512;

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace('#', '');
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function shapeMaskSvg(shape: FlavorShape, size: number): string {
  const half = size / 2;

  switch (shape) {
    case 'circle':
      return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${half}" cy="${half}" r="${half}" fill="white"/>
      </svg>`;
    case 'rounded-square': {
      const inset = size * 0.08;
      const radius = size * 0.18;
      const edge = size - inset * 2;
      return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect x="${inset}" y="${inset}" width="${edge}" height="${edge}" rx="${radius}" ry="${radius}" fill="white"/>
      </svg>`;
    }
    case 'diamond': {
      const margin = size * 0.1;
      return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <polygon points="${half},${margin} ${size - margin},${half} ${half},${
        size - margin
      } ${margin},${half}" fill="white"/>
      </svg>`;
    }
    case 'hexagon': {
      const radius = half * 0.9;
      const points = Array.from({ length: 6 }, (_, index) => {
        const angle = (Math.PI / 3) * index - Math.PI / 6;
        const x = half + radius * Math.cos(angle);
        const y = half + radius * Math.sin(angle);
        return `${x},${y}`;
      });
      return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <polygon points="${points.join(' ')}" fill="white"/>
      </svg>`;
    }
    default:
      throw new Error(`unsupported flavor shape: ${shape as string}`);
  }
}

function innerGlyphSvg(size: number): string {
  const pad = size * 0.28;
  const width = size - pad * 2;
  const height = size - pad * 2;
  const stroke = size * 0.06;
  const p1 = `${pad + width * 0.1},${pad + height * 0.75}`;
  const p2 = `${pad + width * 0.35},${pad + height * 0.25}`;
  const p3 = `${pad + width * 0.5},${pad + height * 0.55}`;
  const p4 = `${pad + width * 0.65},${pad + height * 0.2}`;
  const p5 = `${pad + width * 0.9},${pad + height * 0.7}`;

  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><polyline points="${p1} ${p2} ${p3} ${p4} ${p5}" fill="none" stroke="white" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

async function renderFlavorIcon(entry: FlavorManifestEntry): Promise<Buffer> {
  const { r, g, b } = hexToRgb(entry.color);
  const background = await sharp({
    create: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      channels: 4,
      background: { r, g, b, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  const mask = await sharp(Buffer.from(shapeMaskSvg(entry.shape, ICON_SIZE)))
    .resize(ICON_SIZE, ICON_SIZE)
    .png()
    .toBuffer();

  const glyph = await sharp(Buffer.from(innerGlyphSvg(ICON_SIZE)))
    .resize(ICON_SIZE, ICON_SIZE)
    .png()
    .toBuffer();

  return sharp(background)
    .composite([
      { input: mask, blend: 'dest-in' },
      { input: glyph, blend: 'over' },
    ])
    .png()
    .toBuffer();
}

async function writeFlavorIcons(entry: FlavorManifestEntry): Promise<void> {
  const outDir = path.join(FLAVORS_DIR, entry.key);
  fs.mkdirSync(outDir, { recursive: true });

  const pngBuffer = await renderFlavorIcon(entry);
  const pngPath = path.join(outDir, 'icon.png');
  const icoPath = path.join(outDir, 'icon.ico');

  await fs.promises.writeFile(pngPath, pngBuffer);

  const icoSources = await Promise.all(
    ICO_SIZES.map(async (iconSize) =>
      sharp(pngBuffer).resize(iconSize, iconSize).png().toBuffer()
    )
  );
  await fs.promises.writeFile(icoPath, await pngToIco(icoSources));

  // eslint-disable-next-line no-console
  console.log(`generated ${entry.key} icons (${entry.shape}) -> ${outDir}`);
}

async function main(): Promise<void> {
  fs.mkdirSync(FLAVORS_DIR, { recursive: true });

  const flavors = Object.keys(FLAVOR_MANIFEST) as BuildFlavor[];
  for (const key of flavors) {
    await writeFlavorIcons(FLAVOR_MANIFEST[key]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
