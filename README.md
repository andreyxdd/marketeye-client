# Market-Eye Desktop Suite

<p>
The Market-Eye desktop app tabulates technical indicators for the stocks from NYSE/NASDAQ markets through a light interface.
</p>
<p>The project is built with <a href="https://github.com/andreyxdd/marketeye-api">Market-Eye API</a>, <a href="https://github.com/electron-react-boilerplate/electron-react-boilerplate">Electron React Boilerplate</a>, <a href="https://mui.com/">MUI</a>, and <a href="https://github.com/pmndrs/zustand">Zustand</a>.
</p>

<div align="center">

[![Build Status][github-actions-status]][github-actions-url]
[![Github Tag][github-tag-image]][github-tag-url]

</div>

## Market-Eye API

MarketEye API provides the most recent stock market analytics by calculating individual stock indicators (EMAs, MFI, etc.) as well as market-as-a-whole parameters (VIX, CVI, etc.) using the end-of-day (EOD) historical data. Market-Eye API stores the last three months of data and computes new analytics every working (trading) day.

*Note*: Market-Eye API is accessible only through a private key access (should be initiated in the ```.env``` locally).

## Installing, running, and packaging

### Install

Clone the repo and install dependencies:

```bash
git clone https://github.com/andreyxdd/marketeye-desktop-app.git
cd marketeye-desktop-app
npm install
```

**Having issues installing? The [ERB debugging guide](https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/400) might help**

### Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

### Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

Flavor-specific Windows installers:

```bash
npm run package:win:us
npm run package:win:to
npm run package:win:micro:us
npm run package:win:micro:to
npm run package:win:bounce:us
```

Start StockBounce locally with `npm run start:bounce:us`. It uses `MARKETEYE_MODE=bounce MARKETEYE_MARKET=US`; Toronto bounce is intentionally unsupported. Lookback period and real close-price range are independent. T/T+1/T+2 tracking keeps the originating screen's ordered tickers, and results include period-membership frequencies without a second request.

### Releasing

1. Bump the version in `package.json`.
2. Commit the version bump.
3. Create and push a tag: `git tag v1.4.6 && git push origin v1.4.6`
4. GitHub Actions builds five Windows installers on tag push (`v*`).
5. CI uploads each `.exe`, `.blockmap`, and a flavor-specific `latest.yml` to the GitHub Release.
6. CI deploys five update feeds to GitHub Pages at `updates/{releaseAppName}/latest.yml`.
7. Packaged apps check their baked-in feed on startup via `electron-updater` (generic provider).

Release artifact names follow `artifactName` in `package.json`:

- `MarketEye US-{version}-US-win.exe`
- `MarketEye TSX-{version}-TO-win.exe`
- `MicroFTM-{version}-US-win.exe`
- `MicroFTM TSX-{version}-TO-win.exe`
- `StockBounce-{version}-US-win.exe`

Per-flavor update feeds (stable gh-pages URLs):

| Flavor | Feed |
|--------|------|
| MarketEye US | `https://andreyxdd.github.io/marketeye-client/updates/marketeye-us/` |
| MarketEye TSX | `https://andreyxdd.github.io/marketeye-client/updates/marketeye-tsx/` |
| MicroFTM | `https://andreyxdd.github.io/marketeye-client/updates/microftm-us/` |
| MicroFTM TSX | `https://andreyxdd.github.io/marketeye-client/updates/microftm-tsx/` |
| StockBounce | `https://andreyxdd.github.io/marketeye-client/updates/bounce-us/` |

**One-time setup:** enable GitHub Pages for this repo (Settings → Pages → deploy from `gh-pages` branch).

**Windows note:** installers are unsigned today; SmartScreen may warn until code signing is added.

Flavor publish scripts (full pipeline with `prepare:packaging-assets`):

```bash
npm run package:publish:win:us
npm run package:publish:win:to
npm run package:publish:win:micro:us
npm run package:publish:win:micro:to
npm run package:publish:win:bounce:us
```

### StockBounce archive operations

Recent sessions come from the daily `stock_bounce:v1` canonical snapshot publisher. Historical means every US session still retained by the existing PostgreSQL prune policy, not permanent history. A **degraded coverage** warning means reconstruction combined archived tickers with the current EODHD universe; it is not point-in-time or survivorship-free.

Deploy the API publication and per-market Mongo prune guard before backfilling. US Mongo analytics is retained until both generic analytics and StockBounce artifacts are durable; TO pruning keeps its existing requirements and can proceed independently. Then run the API backfill from `marketeye-api`:

```bash
python scripts/backfill_stock_bounce.py --dry-run
python scripts/backfill_stock_bounce.py
python scripts/backfill_stock_bounce.py --resume-run-id RUN_ID
```

Resume until every target is published and inspect exact/degraded counts and per-session errors. The command exits nonzero while any target is unpublished. Release the desktop flavor only after recent and historical API contract checks pass, then exercise the Windows StockBounce `.exe`, `.blockmap`, and `updates/bounce-us/latest.yml` test-tag artifacts without altering the other four feeds.

### Analytics error handling

- Main-process IPC handlers throw serializable API errors instead of returning `null`/`[]`.
- React Query hooks propagate failures; the data table and US market panel show an MUI `Alert` with **Retry**.
- Background prefetch logs failures and does not seed cache on error; active price band prefetches first, other bands are lazy with concurrency 1.

### Windows co-install verification

Each flavor must keep a unique Windows identity so all five installers can live on one machine:

| Flavor | `appId` | Executable |
|--------|---------|------------|
| MarketEye US | `com.marketeye.standard.us` | `MarketEye US.exe` |
| MarketEye TSX | `com.marketeye.standard.to` | `MarketEye TSX.exe` |
| MicroFTM | `com.marketeye.micro.us` | `MicroFTM.exe` |
| MicroFTM TSX | `com.marketeye.micro.to` | `MicroFTM TSX.exe` |
| StockBounce | `com.marketeye.bounce.us` | `StockBounce.exe` |

Before release, confirm packaging patches identity correctly:

```bash
npm run generate:icons
MARKETEYE_MARKET=US MARKETEYE_PRODUCT_NAME="MarketEye US" npm run prepare:packaging-assets
node -e "console.log(require('./package.json').build.appId)"
git checkout -- package.json release/app/package.json assets/icon.png assets/icon.ico

MARKETEYE_MARKET=TO MARKETEYE_PRODUCT_NAME="MarketEye TSX" npm run prepare:packaging-assets
node -e "console.log(require('./package.json').build.appId)"
git checkout -- package.json release/app/package.json assets/icon.png assets/icon.ico
```

Expect `com.marketeye.standard.us` then `com.marketeye.standard.to`. After installing two or more flavors, verify separate entries in **Apps & features** and distinct Start Menu shortcuts / `.exe` names.

### Docs

See [ERB docs and guides for more details](https://electron-react-boilerplate.js.org/docs/installation)

[github-actions-status]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/workflows/Test/badge.svg
[github-actions-url]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/actions
[github-tag-image]: https://img.shields.io/github/tag/electron-react-boilerplate/electron-react-boilerplate.svg?label=version
[github-tag-url]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/releases/latest
