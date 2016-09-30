import {
  VOZ_LIVING_INIT,
  VOZ_LIVING_GET_THREAD_LIST,
} from '../constants/actionType';

const initState = {
  isRemoveAds: true,
  isWideScreen: true,
  currentView: null,
  threadList: [],
};

const actionsMap = {
  [VOZ_LIVING_INIT](state) {
    let currentView = null;
    if (/forumdisplay/.test(window.location.pathname)) {
      currentView = 'thread-list';
    } else if (/showthread/.test(window.location.pathname)) {
      currentView = 'thread';
    } else if (/newreply/.test(window.location.pathname)) {
      currentView = 'new-reply';
    }
    return { ...state, currentView };
  },
  [VOZ_LIVING_GET_THREAD_LIST](state, action) {
    const { threadList } = action;
    return { ...state, threadList };
  },
};

export default function vozReducer(state = initState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
