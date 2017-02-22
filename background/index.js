import QuoteBackground from './quote';
import followThread from './followThread';
import startCleanTracker from './followThread/cleanTracker';

const quoteBackground = new QuoteBackground();
followThread();
startCleanTracker();

chrome.storage.sync.get('_migrated', (result) => {
  if (!result._migrated) {
    chrome.storage.local.get(null, (oldStorage) => {
      chrome.storage.sync.set({ ...oldStorage, _migrated: true }, () => {
        console.info('Migration done');
      });
      chrome.storage.local.set({ '_migrated_local': true });
    });
  }
});

export {
  quoteBackground,
};
