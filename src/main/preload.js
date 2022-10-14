const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getTickerAnalytics: (req) => ipcRenderer.invoke('get-ticker-analytics', req),
  getAnalyticsListsByCriteria: (req) =>
    ipcRenderer.invoke('get-analytics-lists-by-criteria', req),
  getAnalyticsListsByCriterion: (req) =>
    ipcRenderer.invoke('get-analytics-lists-by-criterion', req),
  getDates: () => ipcRenderer.invoke('get-dates'),
  getMarketAnalytics: (req) => ipcRenderer.invoke('get-market-analytics', req),
  notifyDeveloper: (req) => ipcRenderer.invoke('notify-developer', req),
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
