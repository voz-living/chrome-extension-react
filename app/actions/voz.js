import $ from 'jquery';
import _ from 'lodash';

import {
  VOZ_LIVING_INIT,
  VOZ_LIVING_GET_THREAD_LIST,
} from '../constants/actionType';

import {
  getChromeLocalStore,
  setChromeLocalStore,
} from '../../background/index';

export {
  getChromeLocalStore,
  setChromeLocalStore,
};

export function getCurrentView() {
  let currentView = null;
  if (/forumdisplay/.test(window.location.pathname)) {
    currentView = 'thread-list';
  } else if (/showthread/.test(window.location.pathname)) {
    currentView = 'thread';
  } else if (/newreply/.test(window.location.pathname)) {
    currentView = 'new-reply';
  }
  return currentView;
}

export const init = settings => {
  const currentView = getCurrentView();

  return {
    type: VOZ_LIVING_INIT,
    currentView,
    settings,
  };
};

export const getThreadList = () => {
  const titleList = $('#threadslist tbody[id^="threadbits_forum"] tr td[id^="td_threadtitle_"]');
  const threadList = _.map(titleList, titleTD => {
    const $title = $(titleTD);
    const id = $title.attr('id').match(/\d+/)[0];
    const pages = $title.find('>div span > a');
    const lastPageHref = pages.eq(pages.length - 1).attr('href');
    let lastPage = 1;

    if (lastPageHref) {
      const match = lastPageHref.match(/&page=(\d+)/);
      if (match) lastPage = match[1];
    }

    return { id, pageNum: parseInt(lastPage, 10), element: $title };
  });

  return {
    type: VOZ_LIVING_GET_THREAD_LIST,
    threadList,
  };
};
