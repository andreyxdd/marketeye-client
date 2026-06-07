import { getDisplayName } from '../config/brand';

describe('getDisplayName', () => {
  it('returns MarketEye for standard US', () => {
    expect(getDisplayName('US', 'standard')).toBe('MarketEye');
  });

  it('returns MarketEye TSX for standard TO', () => {
    expect(getDisplayName('TO', 'standard')).toBe('MarketEye TSX');
  });

  it('returns MicroFTM for micro US', () => {
    expect(getDisplayName('US', 'micro')).toBe('MicroFTM');
  });

  it('returns MicroFTM TSX for micro TO', () => {
    expect(getDisplayName('TO', 'micro')).toBe('MicroFTM TSX');
  });
});
