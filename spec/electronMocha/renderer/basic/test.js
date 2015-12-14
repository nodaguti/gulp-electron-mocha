var assert = require('assert');

describe('Renderer process of Electron', function() {
  // Make sure closing the window after running all tests.
  // (maybe this is a bug in electron-mocha?)
  after(function() {
    window.close();
  });

  it('can assert 1+1 is 2', function() {
    assert(1+1 === 2);
  });

  it('can execute an async (setTimeout) test', function(done) {
    setTimeout(function(msg) {
      assert(msg.length > 0);
      done();
    }, 10, 'Hello from 10ms before!');
  });

  it('can access window.localStorage', function() {
    window.localStorage.setItem('electron-mocha', 'Hello!');
    assert(window.localStorage.getItem('electron-mocha') === 'Hello!');
  });

  it('can access document.body', function() {
    assert(document.body.tagName.toLowerCase() === 'body');
  });

  it('can create an new element', function() {
    var el = document.createElement('div');
    el.dataset.electronMocha = 'Hello!';
    assert(el.getAttribute('data-electron-mocha') === 'Hello!');
  });
});
