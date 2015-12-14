import fs from 'fs-promise';
import through from 'through2';
import { spawn } from 'child_process';
import path from 'path';
import assign from 'object-assign';
import toSpawnArgs from 'object-to-spawn-args';
import gutil from 'gulp-util';

const PluginError = gutil.PluginError;
const pluginName = require('../package.json').name;

export default function (opts = {}) {
  const electronPath = opts.electronPath || getElectronPath();
  const electronMochaPath = lookup('electron-mocha/bin/electron-mocha', true);

  if (!electronPath) {
    throw new PluginError(pluginName, 'Cannot find electron.');
  }

  if (!electronMochaPath) {
    throw new PluginError(pluginName, 'Cannot find electron-mocha.');
  }

  opts.electronMocha = toSpawnArgs(opts.electronMocha || {});

  return through.obj(function(file, enc, cb) {
    const paths = {
      electronMocha: electronMochaPath,
      electron: electronPath,
      file: file.path,
    };

    spawnElectronMocha(paths, opts, this, (err) => {
      if (err) {
        return cb(err);
      }

      this.push(file);
      cb();
    });
  });
}

function getElectronPath() {
  const electronPathFile = lookup('electron-prebuilt/path.txt');
  return fs.readFileSync(electronPathFile, 'utf8');
}

function spawnElectronMocha(paths, opts, stream, cb) {
  const args = [...opts.electronMocha, paths.file];
  const env = assign(process.env, { 'ELECTRON_PATH': paths.electron });
  const electronMocha = spawn(paths.electronMocha, args, { env });

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
      cb(new gutil.PluginError(pluginName, err.message));
  });

  electronMocha.on('exit', function (code) {
    if (code === 0 || opts.silent) {
      cb();
    } else {
      cb(new gutil.PluginError(pluginName, 'Test failed. electronMocha exit code: ' + code));
    }
  });
}

export function lookup(pathToLookup, isExecutable) {
  const iz = module.paths.length;

  for (let i = 0; i < iz; i++) {
    let absPath = path.join(module.paths[i], pathToLookup);

    if (isExecutable && process.platform === 'win32') {
      absPath += '.cmd';
    }

    try {
      const stat = fs.statSync(absPath);

      if (stat) {
        return absPath;
      }
    } catch(err) {
      continue;
    }
  }

  return '';
}
