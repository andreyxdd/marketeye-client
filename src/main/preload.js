const { contextBridge, ipcRenderer } = require('electron');

function asIpcError(payload) {
  const error = new Error(payload?.message || 'IPC request failed');
  if (typeof payload?.code === 'string') error.code = payload.code;
  if (typeof payload?.status === 'number') error.status = payload.status;
  return error;
}

async function invoke(channel, req) {
  let result;
  try {
    result = await ipcRenderer.invoke(channel, req);
  } catch (error) {
    throw asIpcError(error);
  }
  if (result?.marketEyeError) throw asIpcError(result.marketEyeError);
  return result;
}

contextBridge.exposeInMainWorld('electronAPI', {
  getTickerAnalytics: (req) => invoke('get-ticker-analytics', req),
  getAnalyticsListsByCriteria: (req) =>
    invoke('get-analytics-lists-by-criteria', req),
  getAnalyticsListsByCriterion: (req) =>
    invoke('get-analytics-lists-by-criterion', req),
  getDates: () => invoke('get-dates'),
  getMarketAnalytics: (req) => invoke('get-market-analytics', req),
  getBounceSessions: (req) => invoke('get-bounce-sessions', req),
  getBounceResults: (req) => invoke('get-bounce-results', req),
  notifyDeveloper: (req) => invoke('notify-developer', req),
  conn: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
