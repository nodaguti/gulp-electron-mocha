/* eslint-disable global-require, import/no-unresolved */
import assert from 'power-assert';

describe('Main process of Electron', () => {
  it('can assert 1+1 is 2', () => {
    assert(1 + 1 === 2);
  });

  it('can execute an async/await test', (done) => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    (async () => {
      await wait(10);
    })().then(() => {
      assert(true);
      done();
    });
  });

  it('can access BrowserWindow', () => {
    const electron = require('electron');
    assert(electron !== undefined || electron !== null);

    const BrowserWindow = electron.BrowserWindow;
    assert(BrowserWindow !== undefined || BrowserWindow !== null);
  });

  it('can create a new window', () => {
    let err;

    try {
      const BrowserWindow = require('electron').BrowserWindow;
      const win = new BrowserWindow({ width: 800, height: 600, show: false });
      win.close();
    } catch (_err) {
      err = _err;
    } finally {
      assert(err === undefined);
    }
  });
});
