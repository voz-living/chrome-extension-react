import _ from 'lodash';
import defaultSettings from './settings';

const defaultSettingKeys = _.keys(defaultSettings);

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
        resolve(items);
      }
    });
  })
);

export const setChromeLocalStore = items => (
  new Promise(resolve => {
    chrome.storage.local.set(items, () => resolve(true));
  })
);
