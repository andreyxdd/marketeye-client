import { FLAVOR_MANIFEST } from '../config/flavorManifest';

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
});
