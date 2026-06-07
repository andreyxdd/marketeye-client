import { getThemeForBuild, getThemeForMarket } from '../config/theme';

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

describe('getThemeForBuild', () => {
  it('uses standard US palette in standard mode', () => {
    const theme = getThemeForBuild('US', 'standard');
    expect(theme.palette.primary.main).toBe('#1976d2');
  });

  it('uses standard TO palette in standard mode', () => {
    const theme = getThemeForBuild('TO', 'standard');
    expect(theme.palette.primary.main).toBe('#1B2A4A');
    expect(theme.palette.secondary.main).toBe('#C9A227');
  });

  it('uses teal palette for micro US', () => {
    const theme = getThemeForBuild('US', 'micro');
    expect(theme.palette.primary.main).toBe('#00897B');
    expect(theme.palette.primary.dark).toBe('#00695C');
  });

  it('uses slate and copper palette for micro TO', () => {
    const theme = getThemeForBuild('TO', 'micro');
    expect(theme.palette.primary.main).toBe('#37474F');
    expect(theme.palette.primary.dark).toBe('#263238');
    expect(theme.palette.secondary.main).toBe('#D4A574');
  });

  it('keeps micro palettes distinct from standard', () => {
    const microUs = getThemeForBuild('US', 'micro');
    const standardUs = getThemeForBuild('US', 'standard');
    expect(microUs.palette.primary.main).not.toBe(
      standardUs.palette.primary.main
    );

    const microTo = getThemeForBuild('TO', 'micro');
    const standardTo = getThemeForBuild('TO', 'standard');
    expect(microTo.palette.primary.main).not.toBe(
      standardTo.palette.primary.main
    );
    expect(microTo.palette.secondary?.main).not.toBe(
      standardTo.palette.secondary?.main
    );
  });
});
