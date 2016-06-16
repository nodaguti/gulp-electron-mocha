# gulp-electron-mocha
> Run client-side Mocha tests in Electron

[![Build Status](https://travis-ci.org/nodaguti/gulp-electron-mocha.svg?branch=master)](https://travis-ci.org/nodaguti/gulp-electron-mocha)
[![Dependency Status](https://david-dm.org/nodaguti/gulp-electron-mocha.svg)](https://david-dm.org/nodaguti/gulp-electron-mocha)
[![devDependency Status](https://david-dm.org/nodaguti/gulp-electron-mocha/dev-status.svg)](https://david-dm.org/nodaguti/gulp-electron-mocha#info=devDependencies)

This is a simple wrapper for [electron-mocha](https://github.com/jprichardson/electron-mocha).

The implementations are mostly inspired by [gulp-mocha-phantomjs](https://github.com/mrhooray/gulp-mocha-phantomjs).


## Install

```sh
npm install --save-dev gulp-electron-mocha
```

Note that you don't have to install either electron-mocha or electron-prebuilt globally (i.e. with `npm i -g`).
All dependencies are resolved automatically.


## Basic Usage

```javascript
import gulp from 'gulp';
import electronMocha from 'gulp-electron-mocha';

gulp.task('test', () =>
  gulp.src('./test', { read: false })
    .pipe(electronMocha())
);
```

Please be aware that you should write `gulp.src('./test')`, not `gulp.src('./test/*.js')`,
because electron-mocha requires a directory to test.

You can also find working tests in [gulpfile.babel.js](https://github.com/nodaguti/gulp-electron-mocha/blob/master/gulpfile.babel.js)
and [spec/electronMocha](https://github.com/nodaguti/gulp-electron-mocha/tree/master/spec/electronMocha)
to learn how to make gulp tasks and client-side Mocha tests with the plugin.


## Passing additional options to electron-mocha

The `electronMocha` property of the optional argument to `electronMocha()`
is passed to electron-mocha.

See [electron-mocha's docs](https://github.com/jprichardson/electron-mocha#run-tests)
to know what parameters are available.

gulp-electron-mocha uses [object-to-spawn-args](https://github.com/75lb/object-to-spawn-args)
to convert from JavaScript object to command-line argument string.

```javascript
import gulp from 'gulp';
import electronMocha from 'gulp-electron-mocha';

gulp.task('test', () =>
  gulp.src('./test', { read: false })
    .pipe(electronMocha({
      electronMocha: {
        renderer: true,
        'no-timeout': true,
      },
    }))
);
```


## Running ES6 tests

gulp-electron-mocha can pass `--compilers` option to Mocha (which is not available in gulp-mocha :/).
So just specify `babel-core/register`.

You want to assert with [power-assert](https://github.com/power-assert-js/power-assert)?
Use `espower-babel/guess`!

```javascript
gulp.src('./test', { read: false })
  .pipe(electronMocha({
    electronMocha: {
      renderer: true,
      compilers: 'js:espower-babel/guess',
      'no-timeout': true,
    },
  }))
```


## API

### electronMocha([options])
#### options

- electronPath

  | Type | Default |
  |:----:|:----:|
  | `string` | `undefined` |

  A path to Electron in which test are executed.
  If not specified, use Electron in `node_modules` instead.

- silent

  | Type | Default |
  |:----:|:----:|
  | `bool` | `false` |

  Don't throw an error even if a test is failed.

- suppressStdout

  | Type | Default |
  |:----:|:----:|
  | `bool` | `false` |

  Don't redirect electron-mocha's stdout to the console.

- suppressStderr

  | Type | Default |
  |:----:|:----:|
  | `bool` | `false` |

  Don't redirect electron-mocha's stderr to the console.

- electronMocha

  | Type | Default |
  |:----:|:----:|
  | `Object` | `{}` |

  Options to be passed to electron-mocha.
  See [electron-mocha's docs](https://github.com/jprichardson/electron-mocha#run-tests)
  for more details.

  The value will be converted to command-line argument string with
  [object-to-spawn-args](https://github.com/75lb/object-to-spawn-args).

  For example, if you want to pass `--no-timeout --renderder -s 200 --compilers js:babel-core/register`,
  specify:

  ```javascript
  electronMocha: {
    'no-timeout': true,
    renderder: true,
    s: 200,
    compilers: 'js:babel-core/register',
  }
  ```


## Events

This plugin emits `electronMochaStdoutData`, `electronMochaStdoutEnd`, `electronMochaStderrData`,
`electronMochaStderrEnd`, `electronMochaError`, `electronMochaExit`,
which are implemented by the following code:

```
electronMocha.stdout.on('data', stream.emit.bind(stream, 'electronMochaStdoutData'));
electronMocha.stdout.on('end', stream.emit.bind(stream, 'electronMochaStdoutEnd'));

electronMocha.stderr.on('data', stream.emit.bind(stream, 'electronMochaStderrData'));
electronMocha.stderr.on('end', stream.emit.bind(stream, 'electronMochaStderrEnd'));

electronMocha.on('error', stream.emit.bind(stream, 'electronMochaError'));
electronMocha.on('exit', stream.emit.bind(stream, 'electronMochaExit'));
```

## Tests
```
npm test
```

## Contribution

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT License (http://nodaguti.mit-license.org/)
