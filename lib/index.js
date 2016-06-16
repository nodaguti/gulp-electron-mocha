'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lookup = lookup;

exports.default = function () {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var electronPath = opts.electronPath || getElectronPath();
  var electronMochaPath = lookup('electron-mocha/bin/electron-mocha', true);

  if (!electronPath) {
    throw new PluginError(pluginName, 'Cannot find electron.');
  }

  if (!electronMochaPath) {
    throw new PluginError(pluginName, 'Cannot find electron-mocha.');
  }

  // We intentionally reassign to the func param in order to spawn args.
  // eslint-disable-next-line no-param-reassign
  opts.electronMocha = (0, _objectToSpawnArgs2.default)(opts.electronMocha || {});

  return _through2.default.obj(function spawnProcess(file, enc, cb) {
    var _this = this;

    var paths = {
      electronMocha: electronMochaPath,
      electron: electronPath,
      file: file.path
    };

    spawnElectronMocha(paths, opts, this, function (err) {
      if (err) {
        cb(err);
        return;
      }

      _this.push(file);
      cb();
    });
  });
};

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var PluginError = _gulpUtil2.default.PluginError;
var pluginName = require('../package.json').name;

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

function getElectronPath() {
  var electronPathFile = lookup('electron-prebuilt/path.txt');
  return _fsPromise2.default.readFileSync(electronPathFile, 'utf8');
}

function spawnElectronMocha(paths, opts, stream, cb) {
  var args = [].concat(_toConsumableArray(opts.electronMocha), [paths.file]);
  var env = (0, _objectAssign2.default)(process.env, { ELECTRON_PATH: paths.electron });
  var electronMocha = (0, _child_process.spawn)(paths.electronMocha, args, { env: env });

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
//# sourceMappingURL=index.js.map