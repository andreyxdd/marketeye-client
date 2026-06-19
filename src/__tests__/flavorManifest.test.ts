import { FLAVOR_MANIFEST } from '../config/flavorManifest';
import { getUpdatesFeedUrl } from '../config/buildFlavor';

describe('FLAVOR_MANIFEST', () => {
  it('defines four installable client flavors', () => {
    expect(Object.keys(FLAVOR_MANIFEST)).toEqual([
      'standard-us',
      'standard-to',
      'micro-us',
      'micro-to',
    ]);
  });

  it('uses unique appIds across all flavors', () => {
    const appIds = Object.values(FLAVOR_MANIFEST).map((entry) => entry.appId);
    expect(new Set(appIds).size).toBe(appIds.length);
  });

  it('uses unique release app names across all flavors', () => {
    const releaseNames = Object.values(FLAVOR_MANIFEST).map(
      (entry) => entry.releaseAppName
    );
    expect(new Set(releaseNames).size).toBe(releaseNames.length);
  });

  it('defines per-flavor gh-pages update feed URLs', () => {
    Object.values(FLAVOR_MANIFEST).forEach((entry) => {
      expect(entry.updatesFeedUrl).toBe(
        `https://andreyxdd.github.io/marketeye-client/updates/${entry.releaseAppName}/`
      );
    });
  });
});

describe('getUpdatesFeedUrl', () => {
  it('returns manifest feed URL for each flavor', () => {
    expect(getUpdatesFeedUrl('standard', 'US')).toBe(
      FLAVOR_MANIFEST['standard-us'].updatesFeedUrl
    );
    expect(getUpdatesFeedUrl('standard', 'TO')).toBe(
      FLAVOR_MANIFEST['standard-to'].updatesFeedUrl
    );
    expect(getUpdatesFeedUrl('micro', 'US')).toBe(
      FLAVOR_MANIFEST['micro-us'].updatesFeedUrl
    );
    expect(getUpdatesFeedUrl('micro', 'TO')).toBe(
      FLAVOR_MANIFEST['micro-to'].updatesFeedUrl
    );
  });
});
