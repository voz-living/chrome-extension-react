import _ from 'lodash';

const defaultSettings = {
  wideScreen: true,
  threadPreview: true,
  adsRemove: true,
  linkHelper: true,
  notifyQuote: true,
  authInfo: {},
  quotes: [],
};

export default defaultSettings;

const defaultSettingKeys = _.keys(defaultSettings);

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
          result[key] = defaultSettings[key];
        });
        resolve(result);
      } else {
        const result = items;
        keys.forEach(key => {
          if (_.isUndefined(result[key])) {
            result[key] = defaultSettings[key];
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
