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
```

### Releasing

1. Bump the version in `package.json`.
2. Commit the version bump.
3. Create and push a tag: `git tag v1.4.6 && git push origin v1.4.6`
4. GitHub Actions builds four Windows installers on tag push (`v*`).
5. Download the installers from the GitHub Release for that tag.
6. Upload the installers to Google Drive manually for distribution.

Release artifact names follow `artifactName` in `package.json`:

- `MarketEye US-{version}-US-win.exe`
- `MarketEye TSX-{version}-TO-win.exe`
- `MicroFTM-{version}-US-win.exe`
- `MicroFTM TSX-{version}-TO-win.exe`

### Windows co-install verification

Each flavor must keep a unique Windows identity so all four installers can live on one machine:

| Flavor | `appId` | Executable |
|--------|---------|------------|
| MarketEye US | `com.marketeye.standard.us` | `MarketEye US.exe` |
| MarketEye TSX | `com.marketeye.standard.to` | `MarketEye TSX.exe` |
| MicroFTM | `com.marketeye.micro.us` | `MicroFTM.exe` |
| MicroFTM TSX | `com.marketeye.micro.to` | `MicroFTM TSX.exe` |

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
