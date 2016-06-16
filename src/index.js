import fs from 'fs-promise';
import through from 'through2';
import spawn from 'cross-spawn';
import path from 'path';
import assign from 'object-assign';
import toSpawnArgs from 'object-to-spawn-args';
import gutil from 'gulp-util';

const PluginError = gutil.PluginError;
const pluginName = require('../package.json').name;

export function lookup(pathToLookup) {
  const iz = module.paths.length;

  for (let i = 0; i < iz; i++) {
    const absPath = path.join(module.paths[i], pathToLookup);

    try {
      const stat = fs.statSync(absPath);

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
  const electronPathFile = lookup('electron-prebuilt/path.txt');
  const electronExecPath = fs.readFileSync(electronPathFile, 'utf8');
  return lookup(path.join('electron-prebuilt', electronExecPath));
}

function spawnElectronMocha(paths, opts, stream, cb) {
  const args = [paths.electronMocha, ...opts.electronMocha, paths.file];
  const env = assign(process.env, { ELECTRON_PATH: paths.electron });
  const electronMocha = spawn(process.argv[0], args, { env });

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

  electronMocha.on('error', (err) => {
    cb(new gutil.PluginError(pluginName, err.message));
  });

  electronMocha.on('exit', (code) => {
    if (code === 0 || opts.silent) {
      cb();
    } else {
      cb(new gutil.PluginError(pluginName, `Test failed. electronMocha exit code: ${code}`));
    }
  });
}

export default function (opts = {}) {
  const electronPath = opts.electronPath || getElectronPath();
  const electronMochaPath = lookup('electron-mocha/bin/electron-mocha');

  if (!electronPath) {
    throw new PluginError(pluginName, 'Cannot find electron.');
  }

  if (!electronMochaPath) {
    throw new PluginError(pluginName, 'Cannot find electron-mocha.');
  }

  // We intentionally reassign to the func param in order to spawn args.
  // eslint-disable-next-line no-param-reassign
  opts.electronMocha = toSpawnArgs(opts.electronMocha || {});

  return through.obj(function spawnProcess(file, enc, cb) {
    const paths = {
      electronMocha: electronMochaPath,
      electron: electronPath,
      file: file.path,
    };

    spawnElectronMocha(paths, opts, this, (err) => {
      if (err) {
        cb(err);
        return;
      }

      this.push(file);
      cb();
    });
  });
}
