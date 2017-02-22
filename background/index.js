import QuoteBackground from './quote';
import followThread from './followThread';
import startCleanTracker from './followThread/cleanTracker';

const quoteBackground = new QuoteBackground();
followThread();
startCleanTracker();

export {
  quoteBackground,
};
