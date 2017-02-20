import $ from 'jquery';
import _ from 'lodash';

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
  VOZ_LIVING_UPDATE_POST_TRACKER,
} from '../constants/actionType';

export const init = (settings, quotes, quickLinks, followThreads, threadTracker) => ({
  type: VOZ_LIVING_INIT,
  settings,
  quotes,
  quickLinks,
  followThreads,
  threadTracker,
});

export const changeOption = (option, value) => ({
  type: VOZ_LIVING_CHANGE_OPTION,
  option,
  value,
});

export const updateQuotes = quotes => ({
  type: VOZ_LIVING_UDATE_QUOTE_LIST,
  quotes,
});

export const markAllQuoteSeen = () => ({
  type: VOZ_LIVING_SEEN_ALL_QUOTE,
});

export const addQuickLink = () => ({
  type: VOZ_LIVING_ADD_QUICK_LINK,
});

export const updateQuickLink = (id, key, value) => ({
  type: VOZ_LIVING_UPDATE_QUICK_LINK,
  id, key, value,
});

export const saveQuickLink = () => ({
  type: VOZ_LIVING_SAVE_QUICK_LINK,
});

export const removeQuickLink = (id) => ({
  type: VOZ_LIVING_REMOVE_QUICK_LINK,
  id,
});

export const updatePostTracker = (post) => ({
  type: VOZ_LIVING_UPDATE_POST_TRACKER,
  post,
});

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
