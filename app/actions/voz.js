import $ from 'jquery';
import _ from 'lodash';

import {
  VOZ_LIVING_INIT,
  VOZ_LIVING_GET_THREAD_LIST,
  VOZ_LIVING_CHANGE_OPTION,
  VOZ_LIVING_UDATE_QUOTE_LIST,
  VOZ_LIVING_SEEN_ALL_QUOTE,
} from '../constants/actionType';

export const init = (settings, quotes) => ({
  type: VOZ_LIVING_INIT,
  settings,
  quotes,
});

export const changeOption = option => ({
  type: VOZ_LIVING_CHANGE_OPTION,
  option,
});

export const updateQuotes = quotes => ({
  type: VOZ_LIVING_UDATE_QUOTE_LIST,
  quotes,
});

export const markAllQuoteSeen = () => ({
  type: VOZ_LIVING_SEEN_ALL_QUOTE,
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
