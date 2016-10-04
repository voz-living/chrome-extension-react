import {
  VOZ_LIVING_INIT,
  VOZ_LIVING_GET_THREAD_LIST,
} from '../constants/actionType';

const initState = {
  settings: {},
  threadList: [],
  currentView: null,
};

const actionsMap = {
  [VOZ_LIVING_INIT](state, action) {
    const { currentView, settings } = action;
    return { ...state, currentView, settings };
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
