import gulp from 'gulp';
import electronMocha from '../../';

const paths = {
  main: {
    basic: './test/electronMocha/main/basic',
    babel: './test/electronMocha/main/babel',
  },
  renderer: {
    basic: './test/electronMocha/renderer/basic',
    babel: './test/electronMocha/renderer/babel',
  },
};

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
        compilers: 'js:babel-core/register',
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
        compilers: 'js:babel-core/register',
        timeout: 30000,
      },
    }))
);

// Ensure nothing will happen when gulp is launched with no arguments.
gulp.task('nop', () => {});
gulp.task('default', ['nop']);
