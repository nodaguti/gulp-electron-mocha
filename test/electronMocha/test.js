import assert from 'power-assert';
import spawn from 'cross-spawn';
import through from 'through2';
import path from 'path';

describe('Gulp-electron-mocha', () => {
  const taskMap = {
    'test:main:basic': 'can run basic mocha tests in main process of Electron',
    'test:main:babel': 'can run ES6 mocha tests with power-assert in main process of Electron',
    'test:renderer:basic': 'can run basic mocha tests in renderer process of Electron',
    'test:renderer:babel': 'can run ES6 mocha tests with power-assert in renderer process of Electron',  // eslint-disable-line max-len
  };

  Object.keys(taskMap).forEach((task) => {
    const desc = taskMap[task];

    it(desc, (done) => {
      const gulp = spawn('gulp', [
        task,
        '--gulpfile',
        path.join(__dirname, 'gulpfile.babel.js'),
      ]);
      const indent = through((chunk, enc, cb) => {
        cb(null, chunk.toString().replace(/^([^\t])/gm, '\t$1'));
      });

      gulp.stdout.pipe(indent).pipe(process.stdout);

      gulp.on('exit', (code) => {
        assert(code === 0, 'Exit code should be 0 (normal).');
        done();
      });
    });
  });
});
