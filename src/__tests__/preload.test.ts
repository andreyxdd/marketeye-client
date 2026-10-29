import { contextBridge, ipcRenderer } from 'electron';
import '../main/preload';

jest.mock('electron', () => ({
  contextBridge: { exposeInMainWorld: jest.fn() },
  ipcRenderer: { invoke: jest.fn() },
}));

function exposedApi() {
  const [firstCall] = (contextBridge.exposeInMainWorld as jest.Mock).mock.calls;
  return firstCall[1] as Window['electronAPI'];
}

describe('preload IPC error serialization', () => {
  beforeEach(() => {
    (ipcRenderer.invoke as jest.Mock).mockReset();
  });

  it('restores structured bounce code, status, and safe message', async () => {
    (ipcRenderer.invoke as jest.Mock).mockResolvedValue({
      marketEyeError: {
        code: 'BOUNCE_SESSION_NOT_READY',
        status: 409,
        message: 'StockBounce publication is incomplete',
      },
    });

    await expect(
      exposedApi().getBounceResults({
        date: '2024-01-01',
        period: 1,
        price_range: 'all',
      })
    ).rejects.toMatchObject({
      code: 'BOUNCE_SESSION_NOT_READY',
      status: 409,
      message: 'StockBounce publication is incomplete',
    });
  });

  it('preserves existing analytics errors across rejected invoke', async () => {
    (ipcRenderer.invoke as jest.Mock).mockRejectedValue({
      code: 'HTTP_503',
      status: 503,
      message: 'Service unavailable',
    });

    await expect(
      exposedApi().getAnalyticsListsByCriteria({ date: '2024-01-01' })
    ).rejects.toMatchObject({
      code: 'HTTP_503',
      status: 503,
      message: 'Service unavailable',
    });
  });
});
