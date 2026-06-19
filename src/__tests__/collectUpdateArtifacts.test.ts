import {
  normalizeInstallerName,
  rewriteLatestYml,
} from '../../.erb/scripts/collect-update-artifacts';

describe('rewriteLatestYml', () => {
  it('rewrites path and files url to the GitHub release download URL', () => {
    const input = `version: 1.5.0
files:
  - url: MarketEye US-1.5.0-US-win.exe
    sha512: abc
    size: 123
path: MarketEye US-1.5.0-US-win.exe
sha512: abc
releaseDate: '2024-01-01'`;

    const releaseUrl =
      'https://github.com/andreyxdd/marketeye-client/releases/download/v1.5.0/MarketEye%20US-1.5.0-US-win.exe';

    expect(rewriteLatestYml(input, releaseUrl)).toBe(`version: 1.5.0
files:
  - url: ${releaseUrl}
    sha512: abc
    size: 123
path: ${releaseUrl}
sha512: abc
releaseDate: '2024-01-01'`);
  });
});

describe('normalizeInstallerName', () => {
  it('treats spaced and hyphenated product names as equivalent', () => {
    expect(normalizeInstallerName('MarketEye-TSX-1.5.1-TO-win.exe')).toBe(
      normalizeInstallerName('MarketEye TSX-1.5.1-TO-win.exe')
    );
    expect(normalizeInstallerName('MarketEye-US-1.5.1-US-win.exe')).toBe(
      normalizeInstallerName('MarketEye US-1.5.1-US-win.exe')
    );
  });
});
