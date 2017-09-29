import _ from 'lodash';

export const defaultStoreStructure = {
  settings: {
    wideScreen: true,
    wideScreenSpecial: false,
    threadPreview: true,
    adsRemove: true,
    linkHelper: true,
    notifyQuote: true,
    emotionHelper: true,
    minimizeQuote: true,
    quickPostQuotation: true,
    reloadButton: true,
    autoGotoNewthread: false,
    savePostEnable: true,
    autoHideSidebar: false,
    peerChatEnable: false,
    capturePostEnable: true,
    LinhXinhBtn: true,
    userStyle: '',
    delay: 1, // minute
    delayFollowThread: 5, // minute
    newThreadUI: false,
    stickerPanelExpand: false,
    smartSelection: false,
    enableRichEditor: false,
  },
  authInfo: {},
  quotes: [],
  quickLinks: [
    {
      id: 'voz_living_f17',
      label: 'F17',
      link: 'https://vozforums.com/forumdisplay.php?f=17',
    },
    {
      id: 'voz_living_f33',
      label: 'F33',
      link: 'https://vozforums.com/forumdisplay.php?f=33',
    },
  ],
  followThreads: {},
  threadTracker: {},
  currentPost: {},
};

const defaultSyncStoreStructure = {
  savedPosts: {},
};

export default defaultStoreStructure;

const defaultSettingKeys = _.keys(defaultStoreStructure);

/* eslint-disable no-undef */
export const getChromeLocalStore = (
  keys = defaultSettingKeys,
  store = 'local',
  defaultStore = defaultStoreStructure
) => (
  new Promise(resolve => {
    chrome.storage[store].get(keys, items => {
      if (_.isEmpty(items)) {
        const result = { };
        let outKeys = keys;
        if (_.isString(outKeys)) {
          outKeys = [outKeys];
        }
        outKeys.forEach(key => {
          result[key] = defaultStore[key];
        });
        resolve(result);
      } else {
        const result = items;
        keys.forEach(key => {
          if (_.isUndefined(result[key])) {
            result[key] = defaultStore[key];
          }
        });
        resolve(result);
      }
    });
  })
);

export const setChromeLocalStore = (items, store = 'local') => (
  new Promise(resolve => {
    chrome.storage[store].set(items, () => resolve(true));
  })
);

export const getChromeSyncStore = (keys) => getChromeLocalStore(keys, 'sync', defaultSyncStoreStructure);
export const setChromeSyncStore = (items) => setChromeLocalStore(items, 'sync');
/* eslint-enable no-undef */
