// Since `new Mocha(opts)` does not support the `--compilers` option,
// we have to use require hook here to compile espowered ES6 code.
require('babel-core/register');

import assert from 'power-assert';
import electronMocha, { lookup } from '../../lib/index.js';

describe('lookup()', () => {
  it('can find a non-executable file', () => {
    const path = lookup('gulp/index.js');

    assert(typeof path === 'string');
    assert(path.indexOf('gulp/index.js') > -1);
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
