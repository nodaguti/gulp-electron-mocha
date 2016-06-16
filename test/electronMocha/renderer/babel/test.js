import assert from 'power-assert';
import path from 'path';

describe('Renderer process of Electron', () => {
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

  it('can access window.localStorage', () => {
    window.localStorage.setItem('electron-mocha', 'Hello!');
    assert(window.localStorage.getItem('electron-mocha') === 'Hello!');
  });

  it('can access document.body', () => {
    assert(document.body.tagName.toLowerCase() === 'body');
  });

  it('can create an new element', () => {
    const el = document.createElement('div');
    el.dataset.electronMocha = 'Hello!';
    assert(el.getAttribute('data-electron-mocha') === 'Hello!');
  });

  it('can test existing HTML and JS stuffs', (done) => {
    const iframe = document.createElement('iframe');

    iframe.src = path.join(__dirname, 'fixture', 'test.html');
    iframe.onload = () => {
      let err;

      try {
        assert(iframe.contentWindow.countDivs() === 4);
      } catch (_err) {
        err = _err;
      } finally {
        assert(err === undefined);
        done();
      }
    };

    document.body.appendChild(iframe);
  });
});
