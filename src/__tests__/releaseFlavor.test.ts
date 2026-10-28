import fs from 'fs';
import path from 'path';
import { FLAVOR_MANIFEST } from '../config/flavorManifest';

const root = path.join(__dirname, '../..');

describe('StockBounce release mapping', () => {
  it('has start, package, and publish scripts', () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(root, 'package.json'), 'utf8')
    );
    expect(pkg.scripts['start:bounce:us']).toContain('MARKETEYE_MODE=bounce');
    expect(pkg.scripts['package:win:bounce:us']).toContain(
      'MARKETEYE_MARKET=US'
    );
    expect(pkg.scripts['package:publish:win:bounce:us']).toContain(
      'StockBounce'
    );
  });

  it('maps only the StockBounce artifact to its independent update feed', () => {
    const workflow = fs.readFileSync(
      path.join(root, '.github/workflows/build-release.yml'),
      'utf8'
    );
    expect(workflow).toContain('script: package:win:bounce:us');
    expect(workflow).toContain('artifact: StockBounce');
    expect(workflow).toContain('releaseAppName: bounce-us');
    expect(workflow).toContain('StockBounce) feedDir=bounce-us ;;');
    expect(FLAVOR_MANIFEST['bounce-us'].updatesFeedUrl).toBe(
      'https://andreyxdd.github.io/marketeye-client/updates/bounce-us/'
    );
  });
});
