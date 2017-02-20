import _ from 'lodash';

import {
  setChromeLocalStore,
} from '../utils/settings';

import {
  VOZ_LIVING_INIT,
  VOZ_LIVING_GET_THREAD_LIST,
  VOZ_LIVING_CHANGE_OPTION,
  VOZ_LIVING_UDATE_QUOTE_LIST,
  VOZ_LIVING_SEEN_ALL_QUOTE,
  VOZ_LIVING_ADD_QUICK_LINK,
  VOZ_LIVING_UPDATE_QUICK_LINK,
  VOZ_LIVING_SAVE_QUICK_LINK,
  VOZ_LIVING_REMOVE_QUICK_LINK,
} from '../constants/actionType';

const initState = {
  settings: {},
  threadList: [],
  quoteList: [],
};

const actionsMap = {
  [VOZ_LIVING_INIT](state, action) {
    const { settings, quotes, quickLinks, followThreads } = action;
    return { ...state, settings, quoteList: quotes, quickLinks, followThreads };
  },
  [VOZ_LIVING_GET_THREAD_LIST](state, action) {
    const { threadList } = action;
    return { ...state, threadList };
  },
  [VOZ_LIVING_UDATE_QUOTE_LIST](state, action) {
    const { quotes } = action;
    return { ...state, quoteList: quotes };
  },
  [VOZ_LIVING_CHANGE_OPTION](state, action) {
    const { settings } = state;
    const { option, value } = action;
    const newValue = value || !settings[option];

    const newSettings = { ...settings, [option]: newValue };

    setChromeLocalStore({ settings: newSettings });

    return {
      ...state,
      settings: newSettings,
    };
  },
  [VOZ_LIVING_SEEN_ALL_QUOTE](state) {
    const { quoteList } = state;
    const clone = _.cloneDeep(quoteList);

    clone.forEach(quote => {
      const outQuote = quote;
      outQuote.hasSeen = true;
    });

    setChromeLocalStore({ quotes: clone });

    return { ...state, quoteList: clone };
  },
  [VOZ_LIVING_ADD_QUICK_LINK](state) {
    const { quickLinks } = state;
    const clone = _.cloneDeep(quickLinks);

    clone.push({
      id: new Date().getTime(),
      label: '',
      link: '',
    });

    return { ...state, quickLinks: clone };
  },
  [VOZ_LIVING_UPDATE_QUICK_LINK](state, action) {
    const { id, key, value } = action;
    const { quickLinks } = state;
    const clone = _.cloneDeep(quickLinks);
    const found = _.find(clone, { id });

    if (found) found[key] = value;

    return { ...state, quickLinks: clone };
  },
  [VOZ_LIVING_SAVE_QUICK_LINK](state) {
    const { quickLinks } = state;
    setChromeLocalStore({ quickLinks });
    return { ...state };
  },
  [VOZ_LIVING_REMOVE_QUICK_LINK](state, action) {
    const { id } = action;
    const { quickLinks } = state;
    const clone = _.cloneDeep(quickLinks);
    _.remove(clone, { id });
    setChromeLocalStore({ quickLinks: clone });
    return { ...state, quickLinks: clone };
  },
};

export default function vozReducer(state = initState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
