# Market-Eye Desktop Suite

<p>
The Market-Eye desktop app tabulates technical indicators for the stocks from NYSE/NASDAQ markets through a light interface.
</p>
<p>The project is built with <a href="https://github.com/andreyxdd/marketeye-api">Market-Eye API</a>, <a href="https://github.com/electron-react-boilerplate/electron-react-boilerplate">Electron React Boilerplate</a>, and <a href="https://mui.com/">MUI</a>.
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

### Docs

See [ERB docs and guides for more details](https://electron-react-boilerplate.js.org/docs/installation)

[github-actions-status]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/workflows/Test/badge.svg
[github-actions-url]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/actions
[github-tag-image]: https://img.shields.io/github/tag/electron-react-boilerplate/electron-react-boilerplate.svg?label=version
[github-tag-url]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/releases/latest
