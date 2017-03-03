import {
  GET,
} from '../../app/utils/http';
import cheerio from 'cheerio';
import cleanHtml from '../../app/utils/cleanHtml';
import {
  setChromeLocalStore,
  getChromeLocalStore,
} from '../../app/utils/settings';
import _ from 'lodash';
import postHelper from '../../app/utils/postHelper';
import getSubscribedThreads from './getSubscribedThreads';

const UPDATE_TIMEOUT_DEFAULT = 60000 * 5;
const REQUEST_TIMEOUT = 1000;
let UPDATE_TIMEOUT = UPDATE_TIMEOUT_DEFAULT; /* 2 min */

function getDelaySetting() {
  return getChromeLocalStore(['settings']).then(({ settings }) => {
    const { delayFollowThread } = settings;
    UPDATE_TIMEOUT = parseInt(delayFollowThread, 10);
    if (_.isNaN(UPDATE_TIMEOUT) || UPDATE_TIMEOUT < 1 || UPDATE_TIMEOUT > 60 * 24){
      UPDATE_TIMEOUT = 5;
    }
    UPDATE_TIMEOUT *= 60000;
    return UPDATE_TIMEOUT;
  });
}

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
        const $$ = cheerio.load(html);
        if ($$('#ChallengForm').length > 0) {
          // threads.unshift(thread);
          console.log('shit happen', $$('#ChallengForm').html());
        } else {
          const postInfo = postHelper($$('body'));
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
  return getChromeLocalStore(['followThreads'])
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
      return threads;
    });
}

function main() {
  console.log('Start to update subscribed thread');
  getDelaySetting()
    .then(getSubscribedThreads)
    .then(validateSubscription)
    .then((threads) => new Promise((resolve) => getAllLastPost(threads, resolve)))
    .then(() => {
      console.info('subscribed threads updated');
      setTimeout(main, UPDATE_TIMEOUT);
    })
    .catch((e) => {
      console.error(e);
      console.info('Error while trying to get subscribed thread, try again next time ...')
      setTimeout(main, UPDATE_TIMEOUT);
    });
}

export default function followThread() {
  main();
}
