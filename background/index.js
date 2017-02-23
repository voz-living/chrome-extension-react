import QuoteBackground from './quote';
import followThread from './followThread';
import startCleanTracker from './followThread/cleanTracker';
import startServices from './services';

const quoteBackground = window.quoteBackground = new QuoteBackground();
followThread();
startCleanTracker();
chrome.runtime.setUninstallURL('https://goo.gl/forms/hA9IzC8XRvJH7pxj2'); // eslint-disable-line no-undef
startServices();

export {
  quoteBackground,
};
