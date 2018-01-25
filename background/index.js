import './ga';
import QuoteBackground from './quote';
import followThread from './followThread';
import startCleanTracker from './followThread/cleanTracker';
import startServices from './services';
import { injectOptionalCSS } from './optionalCSS';

const quoteBackground = new QuoteBackground();

// Test notification remove, it is ok
// for (let i = 0; i < 3; i++) {
//   setTimeout(() => chrome.notifications.create('voz-living', {
//     type: 'basic',
//     title: 'VOZLiving',
//     message: 'test cái coi',
//     iconUrl: '../assert/icon/64.png',
//   }, (noti5Id1) => {
//     const handler = (noti5Id2) => {
//       console.log(i);
//       console.log(noti5Id1, noti5Id2);
//       chrome.notifications.clear('voz-living');
//       chrome.notifications.onClicked.removeListener(handler);
//     };
//     chrome.notifications.onClicked.addListener(handler);
//   }), 3000*i);
// }

followThread();
startCleanTracker();
chrome.runtime.setUninstallURL('https://goo.gl/forms/hA9IzC8XRvJH7pxj2'); // eslint-disable-line no-undef
startServices();

chrome.tabs.onCreated.addListener(injectOptionalCSS);
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status && info.status === 'loading') injectOptionalCSS(tab);
});

export function onNewVersion(fn) {
  const manifestData = chrome.runtime.getManifest();
  const oldVersion = localStorage.getItem('current_version');
  const newVersion = manifestData.version + '';
  console.log(oldVersion, newVersion);
  if (oldVersion !== newVersion) {
    fn();
    localStorage.setItem('current_version', newVersion);
  }
}

onNewVersion(() => {
  // reset settings
  chrome.storage.local.get('settings', (storage) => {
    chrome.storage.local.set({
      settings: {
        ...storage.settings,
        userStyle: 'https://userstyles.org/styles/154630/voz-forums-u23-vietnam-theme',
      },
    });
  });
});

export {
  quoteBackground,
};
