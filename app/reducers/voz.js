import {
  setChromeLocalStore,
} from '../../background/index';

import {
  VOZ_LIVING_INIT,
  VOZ_LIVING_GET_THREAD_LIST,
  VOZ_LIVING_CHANGE_OPTION,
} from '../constants/actionType';

const initState = {
  settings: {},
  threadList: [],
};

const actionsMap = {
  [VOZ_LIVING_INIT](state, action) {
    const { settings } = action;
    return { ...state, settings };
  },
  [VOZ_LIVING_GET_THREAD_LIST](state, action) {
    const { threadList } = action;
    return { ...state, threadList };
  },
  [VOZ_LIVING_CHANGE_OPTION](state, action) {
    const { settings } = state;
    const newSettings = { ...settings, [action.option]: !settings[action.option] };

    setChromeLocalStore(newSettings);

    return {
      ...state,
      settings: newSettings,
    };
  },
};

export default function vozReducer(state = initState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
