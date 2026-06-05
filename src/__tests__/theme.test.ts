import { getThemeForMarket } from '../config/theme';

describe('getThemeForMarket', () => {
  it('uses default blue primary for US', () => {
    const theme = getThemeForMarket('US');
    expect(theme.palette.primary.main).toBe('#1976d2');
  });

  it('uses navy and gold palette for TO', () => {
    const theme = getThemeForMarket('TO');
    expect(theme.palette.primary.main).toBe('#1B2A4A');
    expect(theme.palette.secondary.main).toBe('#C9A227');
  });
});
