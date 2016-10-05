import $ from 'jquery';
import _ from 'lodash';

import {
  VOZ_LIVING_INIT,
  VOZ_LIVING_GET_THREAD_LIST,
  VOZ_LIVING_CHANGE_OPTION,
} from '../constants/actionType';

export const init = settings => ({
  type: VOZ_LIVING_INIT,
  settings,
});

export const changeOption = option => ({
  type: VOZ_LIVING_CHANGE_OPTION,
  option,
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
