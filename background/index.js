import QuoteBackground from './quote';
import followThread from './followThread';
import startCleanTracker from './followThread/cleanTracker';

const quoteBackground = window.quoteBackground = new QuoteBackground();
followThread();
startCleanTracker();

export {
  quoteBackground,
};
