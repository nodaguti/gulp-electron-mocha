import gulp from 'gulp';
import seq from 'run-sequence';
import mocha from 'gulp-mocha';
import electronMocha from './';

const paths = {
  unit: './spec/unit/*.js',
  electronMocha: './spec/electronMocha/*.js',
  main: {
    basic: './spec/electronMocha/main/basic',
    babel: './spec/electronMocha/main/babel',
  },
  renderer: {
    basic: './spec/electronMocha/renderer/basic',
    babel: './spec/electronMocha/renderer/babel',
  }
};

gulp.task('test', () => seq(
  'test:unit',
  'test:electronMocha',
));

gulp.task('test:unit', () =>
  gulp.src(paths.unit)
    .pipe(mocha())
);

gulp.task('test:electronMocha', () =>
  gulp.src(paths.electronMocha, { read: false })
    .pipe(mocha({ timeout: 120000 }))
);

gulp.task('test:main:basic', () =>
  gulp.src(paths.main.basic, { read: false })
    .pipe(electronMocha({
      electronMocha: {
        timeout: 30000,
      },
    }))
);

gulp.task('test:main:babel', () =>
  gulp.src(paths.main.babel, { read: false })
    .pipe(electronMocha({
      electronMocha: {
        compilers: 'js:espower-babel/guess',
        timeout: 30000,
      },
    }))
);

gulp.task('test:renderer:basic', () =>
  gulp.src(paths.renderer.basic, { read: false })
    .pipe(electronMocha({
      electronMocha: {
        renderer: true,
        timeout: 30000,
      },
    }))
);

gulp.task('test:renderer:babel', () =>
  gulp.src(paths.renderer.babel, { read: false })
    .pipe(electronMocha({
      electronMocha: {
        renderer: true,
        compilers: 'js:espower-babel/guess',
        timeout: 30000,
      },
    }))
);

// Ensure nothing will happen when gulp is launched with no arguments.
gulp.task('nop', () => {});
gulp.task('default', ['nop']);
