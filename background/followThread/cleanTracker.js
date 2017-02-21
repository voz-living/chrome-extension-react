import {
  setChromeLocalStore,
  getChromeLocalStore,
} from '../../app/utils/settings';
import _ from 'lodash';

const TRACKER_EXPIRY = 1000 * 60 * 60 * 24; // 1 day;

function cleanTracker() {
  getChromeLocalStore(['threadTracker', 'followThreads'])
    .then((result) => {
      const { threadTracker, followThreads } = result;
      const now = new Date().getTime();
      return Object.keys(threadTracker).reduce((keep, threadId) => {
        const tracker = threadTracker[threadId];
        const elapsed = now - tracker.lastView;
        if (elapsed < TRACKER_EXPIRY || !_.isUndefined(followThreads[threadId])) {
          keep[threadId] = tracker;
        }
        return keep;
      }, {});
    })
    .then((threadTracker) => {
      setChromeLocalStore({ threadTracker }).then(() => {
        console.info('Removed expired tracker');
      });
    });
}

export default function startCleanTracker() {
  setInterval(cleanTracker, TRACKER_EXPIRY / 6);
}
