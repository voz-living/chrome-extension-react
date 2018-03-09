import { getLocalSettings } from '../utils/settings';

function disableNextVoz() {
  Object.defineProperty(window, 'checkThreadStatus', {
    writeable: false,
    configurable: false,
    value: () => {
      console.log('You are not going anywhere!');
      return {};
    },
  })
}

function appendScript() {
  const script = document.createElement('script');
  script.textContent = `(${disableNextVoz.toString()})()`;
  document.head.appendChild(script);
}

function observe() {
  if (document.head) {
    appendScript();
  } else {
    new MutationObserver(function (mutations) {
      if (document.head) {
        this.disconnect();
        appendScript();
      }
    }).observe(document.documentElement, { childList: true });
  }
}

export function keepMeBaby() {
  // double shield
  let observed = false;
  if (localStorage.getItem('disableNextVoz') === 'true') {
    observe();
    observed = true;
  }

  getLocalSettings()
    .then((settings) => {
      if (settings.disableNextVoz === true && !observed) {
        observe();
      }
      localStorage.setItem('disableNextVoz', settings.disableNextVoz === true ? 'true' : 'false');
    });
}