import { yahooQuoteUrl } from '../config/market';

describe('yahooQuoteUrl', () => {
  it('returns US finance.yahoo URL for US market', () => {
    expect(yahooQuoteUrl('AAPL', 'US')).toBe(
      'https://finance.yahoo.com/quote/AAPL'
    );
  });

  it('returns ca.finance.yahoo URL with .TO suffix for TO market', () => {
    expect(yahooQuoteUrl('GGD', 'TO')).toBe(
      'https://ca.finance.yahoo.com/quote/GGD.TO/'
    );
  });
});
