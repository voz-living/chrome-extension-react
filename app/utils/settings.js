import _ from 'lodash';

const defaultStoreStructure = {
  settings: {
    wideScreen: true,
    threadPreview: true,
    adsRemove: true,
    linkHelper: true,
    notifyQuote: true,
    emotionHelper: true,
    delay: 10, // minute
  },
  authInfo: {},
  quotes: [],
  quickLinks: [
    {
      id: 'voz_living_f17',
      label: 'F17',
      link: 'https://vozforums.com/forumdisplay.php?f=17',
    },
  ],
};

export default defaultStoreStructure;

const defaultSettingKeys = _.keys(defaultStoreStructure);

/* eslint-disable no-undef */
export const getChromeLocalStore = (keys = defaultSettingKeys) => (
  new Promise(resolve => {
    chrome.storage.local.get(keys, items => {
      if (_.isEmpty(items)) {
        const result = { };
        let outKeys = keys;
        if (_.isString(outKeys)) {
          outKeys = [outKeys];
        }
        outKeys.forEach(key => {
          result[key] = defaultStoreStructure[key];
        });
        resolve(result);
      } else {
        const result = items;
        keys.forEach(key => {
          if (_.isUndefined(result[key])) {
            result[key] = defaultStoreStructure[key];
          }
        });
        resolve(result);
      }
    });
  })
);

export const setChromeLocalStore = items => (
  new Promise(resolve => {
    chrome.storage.local.set(items, () => resolve(true));
  })
);
/* eslint-enable no-undef */
