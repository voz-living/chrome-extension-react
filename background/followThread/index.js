import {
  GET,
} from '../../app/utils/http';
import $ from 'jquery';
import cleanHtml from '../../app/utils/cleanHtml';
import {
  setChromeLocalStore,
} from '../../app/utils/settings';

import postHelper from '../../app/utils/postHelper';
import getSubscribedThreads from './getSubscribedThreads';

const REQUEST_TIMEOUT = 500;
const UPDATE_TIMEOUT = 60000; /* 1 min */
let lastUpdate = -1;
let updateInProgress = false;

function getAllLastPost(threads, cb, store = {}) {
  if (threads.length > 0) {
    const {
      id,
      lastPage,
      title,
    } = threads.shift();

    GET(`https://vozforums.com/showthread.php?t=${id}&page=${lastPage}`).then((html) => {
      const postInfo = postHelper($(cleanHtml(html, ['images'])));
      const latestPost = Object.assign({
        title,
        page: lastPage,
      }, postInfo.getLatestPost() /* postNum, id */);
      setTimeout(getAllLastPost.bind(null, threads, cb, Object.assign({}, store, {
        [id]: latestPost,
      })), REQUEST_TIMEOUT);
    });
  } else {
    cb(store);
  }
}

function updateStorage(threads) {
  setChromeLocalStore({
    followThreads: threads,
  });
  return true;
}

function main() {
  const current = new Date().getTime();
  if (current - lastUpdate < UPDATE_TIMEOUT || updateInProgress === true) return;
  updateInProgress = true;
  getSubscribedThreads()
    .then((threads) => new Promise((resolve) => getAllLastPost(threads, resolve)))
    .then(updateStorage).then(() => {
      console.info('subscribed threads updated');
      updateInProgress = false;
      lastUpdate = new Date().getTime();
    });
}

export default function followThread() {
  main();
  setInterval(main, UPDATE_TIMEOUT / 2 + UPDATE_TIMEOUT * 0.05);
}
