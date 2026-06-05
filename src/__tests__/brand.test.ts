import { getDisplayName } from '../config/brand';

describe('getDisplayName', () => {
  it('returns MarketEye for US', () => {
    expect(getDisplayName('US')).toBe('MarketEye');
  });

  it('returns MarketEye TSX for TO', () => {
    expect(getDisplayName('TO')).toBe('MarketEye TSX');
  });
});
