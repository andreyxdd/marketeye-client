import { MarketEyeTransport } from '../main/transport';

const get = jest.fn();
const post = jest.fn();
const http = { get, post };

function transport() {
  return new MarketEyeTransport({
    baseUrl: 'https://api.example/api',
    apiKey: 'secret',
    market: 'US',
    http: http as never,
  });
}

describe('MarketEyeTransport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    get.mockResolvedValue({ data: {} });
    post.mockResolvedValue({ data: {} });
  });

  it('preserves analytics URL, credential, and optional-band behavior', async () => {
    const subject = transport();
    get.mockResolvedValue({ data: { volume: [] } });

    await subject.getAnalyticsListsByCriterion({
      date: '2024-01-01',
      criterion: 'volume',
      price_band: 'lte5',
    });
    await subject.getAnalyticsListsByCriteria({ date: '2024-01-01' });

    expect(get).toHaveBeenNthCalledWith(
      1,
      'https://api.example/api/analytics/get_analytics_lists_by_criterion',
      {
        params: {
          date: '2024-01-01',
          criterion: 'volume',
          market: 'US',
          price_band: 'lte5',
          api_key: 'secret',
        },
      }
    );
    expect(get).toHaveBeenNthCalledWith(
      2,
      'https://api.example/api/analytics/get_analytics_lists_by_criteria',
      {
        params: { date: '2024-01-01', market: 'US', api_key: 'secret' },
      }
    );
  });

  it('maps paginated sessions and complete bounce requests without legacy routes', async () => {
    const subject = transport();
    get.mockResolvedValue({ data: { items: [], next_cursor: null } });

    await subject.getBounceSessions({ cursor: 'opaque', limit: 500 });
    await subject.getBounceResults({
      date: '2024-01-01',
      period: 6,
      price_range: '100to299_99',
      tickers: ['AAA', 'BBB'],
    });

    expect(get).toHaveBeenNthCalledWith(
      1,
      'https://api.example/api/stock-bounce/v1/sessions',
      {
        params: { cursor: 'opaque', limit: 500, api_key: 'secret' },
      }
    );
    expect(get).toHaveBeenNthCalledWith(
      2,
      'https://api.example/api/stock-bounce/v1/results',
      {
        params: {
          date: '2024-01-01',
          period: 6,
          price_range: '100to299_99',
          tickers: 'AAA,BBB',
          api_key: 'secret',
        },
      }
    );
  });

  it('returns criterion data in the existing renderer shape', async () => {
    get.mockResolvedValue({ data: { volume: [{ ticker: 'AAA' }] } });
    await expect(
      transport().getAnalyticsListsByCriterion({
        date: '2024-01-01',
        criterion: 'volume',
      })
    ).resolves.toEqual([{ ticker: 'AAA' }]);
  });
});
