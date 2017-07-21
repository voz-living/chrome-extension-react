import './ga';
import QuoteBackground from './quote';
import followThread from './followThread';
import startCleanTracker from './followThread/cleanTracker';
import startServices from './services';
import { injectOptionalCSS } from './optionalCSS';

const quoteBackground = new QuoteBackground();

followThread();
startCleanTracker();
chrome.runtime.setUninstallURL('https://goo.gl/forms/hA9IzC8XRvJH7pxj2'); // eslint-disable-line no-undef
startServices();

chrome.tabs.onCreated.addListener(injectOptionalCSS);
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status && info.status === 'loading') injectOptionalCSS(tab);
});

export {
  quoteBackground,
  peerChartBackground,
};
