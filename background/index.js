import QuoteBackground from './quote';
import followThread from './followThread';
import startCleanTracker from './followThread/cleanTracker';
import PeerChatBackGround from './peerChat';

const quoteBackground = new QuoteBackground();
const peerChartBackground = new PeerChatBackGround('http://localhost:3030');

followThread();
startCleanTracker();

export {
  quoteBackground,
  peerChartBackground,
};
