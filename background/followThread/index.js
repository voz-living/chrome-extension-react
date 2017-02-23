import {
  GET,
} from '../../app/utils/http';
import $ from 'jquery';
import cleanHtml from '../../app/utils/cleanHtml';
import {
  setChromeLocalStore,
  getChromeLocalStore,
} from '../../app/utils/settings';

import postHelper from '../../app/utils/postHelper';
import getSubscribedThreads from './getSubscribedThreads';

const REQUEST_TIMEOUT = 1000;
const UPDATE_TIMEOUT = 60000 * 2; /* 2 min */

function getAllLastPost(threads, cb) {
  if (threads.length > 0) {
    const thread = threads.shift();
    const {
      id,
      lastPage,
      title,
    } = thread;

    GET(`https://vozforums.com/showthread.php?t=${id}&page=${lastPage}`).then((html) => { // eslint-disable-line new-cap
      try {
        const $html = $(cleanHtml(html, ['images']));
        if ($html.find('#ChallengForm').length > 0) {
          // threads.unshift(thread);
        } else {
          const postInfo = postHelper($html);
          const latestPost = Object.assign({
            title,
            page: lastPage,
          }, postInfo.getLatestPost() /* postNum, id */);
          getChromeLocalStore(['followThreads'])
            .then(({ followThreads }) => {
              setChromeLocalStore({
                followThreads: {
                  ...followThreads,
                  [id]: latestPost,
                },
              });
            });
        }
      } catch (e) {
        console.error(e);
      }
      setTimeout(getAllLastPost.bind(null, threads, cb), REQUEST_TIMEOUT);
    }).catch((e) => {
      // threads.unshift(thread);
      console.log(e);
      setTimeout(getAllLastPost.bind(null, threads, cb), REQUEST_TIMEOUT * 5);
    });
  } else {
    cb();
  }
}

function validateSubscription(threads) {
  getChromeLocalStore(['followThreads'])
    .then(({ followThreads }) => {
      const validList = threads.map(t => t.id);
      const checkedMap = Object.keys(followThreads)
        .reduce((map, id) => {
          if (validList.indexOf(id) > -1) map[id] = followThreads[id];
          return map;
        }, {});
      setChromeLocalStore({
        followThreads: checkedMap,
      });
    });
  return threads;
}

function main() {
  console.log('Start to update subscribed thread');
  getSubscribedThreads()
    .then(validateSubscription)
    .then((threads) => new Promise((resolve) => getAllLastPost(threads, resolve)))
    .then(() => {
      console.info('subscribed threads updated');
      setTimeout(main, UPDATE_TIMEOUT);
    });
}

export default function followThread() {
  main();
}
