/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import axios from 'axios';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { IDataProps, IDateProps } from '../types';
import { APP_MODE } from '../config/appMode';
import { getFlavorIconDir } from '../config/buildFlavor';
import { MARKET, showMarketWidePanel } from '../config/market';
import { throwApiError } from './apiError';

const MARKETEYE_API_URL = process.env.MARKETEYE_API_URL ?? '';
const MARKETEYE_API_KEY = process.env.MARKETEYE_API_KEY ?? '';
const MARKETEYE_UPDATES_FEED_URL = process.env.MARKETEYE_UPDATES_FEED_URL ?? '';

export default class AppUpdater {
  constructor() {
    if (!app.isPackaged) {
      return;
    }

    log.transports.file.level = 'info';
    autoUpdater.logger = log;

    if (MARKETEYE_UPDATES_FEED_URL) {
      log.info(`Using update feed: ${MARKETEYE_UPDATES_FEED_URL}`);
      autoUpdater.setFeedURL({
        provider: 'generic',
        url: MARKETEYE_UPDATES_FEED_URL,
      });
    } else {
      log.warn('MARKETEYE_UPDATES_FEED_URL is empty; skipping feed configuration');
    }

    autoUpdater.on('checking-for-update', () => {
      log.info('Checking for update');
    });
    autoUpdater.on('update-available', (info) => {
      log.info('Update available', info);
    });
    autoUpdater.on('update-not-available', (info) => {
      log.info('Update not available', info);
    });
    autoUpdater.on('error', (err) => {
      log.error('Auto-updater error', err);
    });
    autoUpdater.on('download-progress', (progress) => {
      log.info('Download progress', progress);
    });
    autoUpdater.on('update-downloaded', (info) => {
      log.info('Update downloaded', info);
    });

    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// ---
// Communication routes

ipcMain.handle('get-ticker-analytics', async (_event, arg) => {
  try {
    const response = await axios.get(
      `${MARKETEYE_API_URL}/analytics/get_ticker_analytics`,
      {
        params: {
          date: arg.date,
          ticker: arg.ticker,
          criterion: arg.criterion,
          market: MARKET,
          api_key: MARKETEYE_API_KEY,
        },
      }
    );

    const tickerData: IDataProps = response.data;
    return tickerData;
  } catch (e) {
    throwApiError(e);
  }
});

ipcMain.handle('get-analytics-lists-by-criteria', async (_event, arg) => {
  try {
    const params: Record<string, string> = {
      date: arg.date,
      market: MARKET,
      api_key: MARKETEYE_API_KEY,
    };
    if (arg.price_band) {
      params.price_band = arg.price_band;
    }
    const response = await axios.get(
      `${MARKETEYE_API_URL}/analytics/get_analytics_lists_by_criteria`,
      {
        params,
      }
    );
    const { data } = response;
    return data;
  } catch (e) {
    throwApiError(e);
  }
});

ipcMain.handle('get-analytics-lists-by-criterion', async (_event, arg) => {
  try {
    const params: Record<string, string> = {
      date: arg.date,
      criterion: arg.criterion,
      market: MARKET,
      api_key: MARKETEYE_API_KEY,
    };
    if (arg.price_band) {
      params.price_band = arg.price_band;
    }
    const response = await axios.get(
      `${MARKETEYE_API_URL}/analytics/get_analytics_lists_by_criterion`,
      { params }
    );
    const { data } = response;
    return data[arg.criterion];
  } catch (e) {
    throwApiError(e);
  }
});

ipcMain.handle('get-dates', async () => {
  try {
    const response = await axios.get(
      `${MARKETEYE_API_URL}/analytics/get_dates`,
      {
        params: {
          market: MARKET,
          api_key: MARKETEYE_API_KEY,
        },
      }
    );

    const dates: IDateProps = response.data;
    return dates;
  } catch (e) {
    throwApiError(e);
  }
});

ipcMain.handle('get-market-analytics', async (_event, arg) => {
  if (!showMarketWidePanel) {
    return null;
  }
  try {
    const response = await axios.get(
      `${MARKETEYE_API_URL}/analytics/get_market_analytics`,
      {
        params: {
          date: arg.date,
          api_key: MARKETEYE_API_KEY,
        },
      }
    );
    const { data } = response;
    return data;
  } catch (e) {
    throwApiError(e);
  }
});

ipcMain.handle('notify-developer', async (_event, arg) => {
  try {
    await axios.post(
      `${MARKETEYE_API_URL}/notifications/notify_developer`,
      { email_body: arg.body, email_subject: arg.subject },
      {
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        params: {
          api_key: MARKETEYE_API_KEY,
        },
      }
    );
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false, error: e };
  }
});

// ---

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const flavorIconName = path.join(
    getFlavorIconDir(APP_MODE, MARKET),
    'icon.png'
  );

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 960,
    icon: getAssetPath(flavorIconName),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.maximize();

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  if (app.isPackaged) {
    // eslint-disable-next-line no-new
    new AppUpdater();
  }
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
