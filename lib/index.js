'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var electronPathFile = lookup('electron-prebuilt/path.txt');
  var electronPath = _fsPromise2.default.readFileSync(electronPathFile, 'utf8');
  var electronMochaPath = lookup('electron-mocha/bin/electron-mocha', true);

  if (!electronMochaPath) {
    throw new PluginError(pluginName, 'Cannot find electron-mocha.');
  }

  opts.electronMocha = (0, _objectToSpawnArgs2.default)(opts.electronMocha || {});

  return _through2.default.obj(function (file, enc, cb) {
    var _this = this;

    var paths = {
      electronMocha: electronMochaPath,
      electron: electronPath,
      file: file.path
    };

    spawnElectronMocha(paths, opts, this, function (err) {
      if (err) {
        return cb(err);
      }

      _this.push(file);
      cb();
    });
  });
};

exports.lookup = lookup;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _objectToSpawnArgs = require('object-to-spawn-args');

var _objectToSpawnArgs2 = _interopRequireDefault(_objectToSpawnArgs);

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PluginError = _gulpUtil2.default.PluginError;
var pluginName = require('../package.json').name;

function spawnElectronMocha(paths, opts, stream, cb) {
  var args = [].concat((0, _toConsumableArray3.default)(opts.electronMocha), [paths.file]);
  var env = (0, _objectAssign2.default)(process.env, { 'ELECTRON_PATH': paths.electron });
  var electronMocha = (0, _child_process.spawn)(paths.electronMocha, args, { env: env });

  if (opts.logfile) {
    var writeStream = _fsPromise2.default.createWriteStream(opts.logfile, { flags: 'a' });
    electronMocha.stdout.pipe(writeStream);
  }

  if (!opts.suppressStdout) {
    electronMocha.stdout.pipe(process.stdout);
  }

  if (!opts.suppressStderr) {
    electronMocha.stderr.pipe(process.stderr);
  }

  electronMocha.stdout.on('data', stream.emit.bind(stream, 'electronMochaStdoutData'));
  electronMocha.stdout.on('end', stream.emit.bind(stream, 'electronMochaStdoutEnd'));

  electronMocha.stderr.on('data', stream.emit.bind(stream, 'electronMochaStderrData'));
  electronMocha.stderr.on('end', stream.emit.bind(stream, 'electronMochaStderrEnd'));

  electronMocha.on('error', stream.emit.bind(stream, 'electronMochaError'));
  electronMocha.on('exit', stream.emit.bind(stream, 'electronMochaExit'));

  electronMocha.on('error', function (err) {
    cb(new _gulpUtil2.default.PluginError(pluginName, err.message));
  });

  electronMocha.on('exit', function (code) {
    if (code === 0 || opts.silent) {
      cb();
    } else {
      cb(new _gulpUtil2.default.PluginError(pluginName, 'Test failed. electronMocha exit code: ' + code));
    }
  });
}

function lookup(pathToLookup, isExecutable) {
  var iz = module.paths.length;

  for (var i = 0; i < iz; i++) {
    var absPath = _path2.default.join(module.paths[i], pathToLookup);

    if (isExecutable && process.platform === 'win32') {
      absPath += '.cmd';
    }

    try {
      var stat = _fsPromise2.default.statSync(absPath);

      if (stat) {
        return absPath;
      }
    } catch (err) {
      continue;
    }
  }

  return '';
}
//# sourceMappingURL=index.js.map