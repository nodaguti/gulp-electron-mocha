/* eslint-disable */
var assert = require('assert');

describe('Main process of Electron', function () {
  it('can assert 1+1 is 2', function () {
    assert(1 + 1 === 2);
  });

  it('can execute an async (setTimeout) test', function (done) {
    setTimeout(function (msg) {
      assert(msg.length > 0);
      done();
    }, 10, 'Hello from 10ms before!');
  });

  it('can access BrowserWindow', function () {
    var electron = require('electron');
    assert(electron !== undefined || electron !== null);

    var BrowserWindow = electron.BrowserWindow;
    assert(BrowserWindow !== undefined || BrowserWindow !== null);
  });

  it('can create a new window', function () {
    var err;

    try {
      var BrowserWindow = require('electron').BrowserWindow;
      var win = new BrowserWindow({ width: 800, height: 600, show: false });
      win.close();
    } catch (_err) {
      err = _err;
    } finally {
      assert(err === undefined);
    }
  });
});
