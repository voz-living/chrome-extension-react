import QuoteBackground from './quote';
import followThread from './followThread';
import startCleanTracker from './followThread/cleanTracker';
import PeerChatBackGround from './peerChat';
import startServices from './services';

const quoteBackground = new QuoteBackground();
const peerChartBackground = new PeerChatBackGround('http://localhost:3030');

followThread();
startCleanTracker();
chrome.runtime.setUninstallURL('https://goo.gl/forms/hA9IzC8XRvJH7pxj2'); // eslint-disable-line no-undef
startServices();

export {
  quoteBackground,
  peerChartBackground,
};
