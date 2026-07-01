import { formatAboutVersion } from '../main/menu';

describe('formatAboutVersion', () => {
  it('prefixes semver with v', () => {
    expect(formatAboutVersion('1.5.5')).toBe('v1.5.5');
  });
});
