import {
  setChromeLocalStore,
} from '../utils/settings';

import {
  VOZ_LIVING_INIT,
  VOZ_LIVING_GET_THREAD_LIST,
  VOZ_LIVING_CHANGE_OPTION,
  VOZ_LIVING_UDATE_QUOTE_LIST,
  VOZ_LIVING_SEEN_ALL_QUOTE,
} from '../constants/actionType';

const initState = {
  settings: {},
  threadList: [],
  quoteList: [],
};

const actionsMap = {
  [VOZ_LIVING_INIT](state, action) {
    const { settings, quotes } = action;
    return { ...state, settings, quoteList: quotes };
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
};

export default function vozReducer(state = initState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
