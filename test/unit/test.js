import { lookup } from '../../lib/index.js';
import assert from 'power-assert';

describe('lookup()', () => {
  it('can find a non-executable file', () => {
    const path = lookup('gulp/index.js');

    assert(typeof path === 'string');
    assert(/gulp.index\.js$/.test(path) === true);
  });

  it('can find an executable file', () => {
    const path = lookup('.bin/gulp', true);

    if (path) {
      assert(path.indexOf('gulp') > -1);
    } else {
      const path2 = lookup('gulp/bin/gulp.js', true);
      assert(path2.indexOf('gulp') > -1);
    }
  });
});
