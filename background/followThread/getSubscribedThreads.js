import $ from 'jquery';
import {
  GET,
} from '../../app/utils/http';
import cleanHtml from '../../app/utils/cleanHtml';

const SUBSCRIPTION_LINK = 'https://vozforums.com/subscription.php?do=viewsubscription';

export default function getSubscribedThreads() {
  return GET(SUBSCRIPTION_LINK).then((html) => {
    const $html = $(cleanHtml(html, ['images']));
    const form = $html.find("form[action*='subscription.php?do=dostuff']");
    if (form.length === 0) {
      if ($html.find("*:contains('You are not logged in or you do not have permission to access this page')").length > 0) {
        console.info('Loged In = false');
      }
      return false;
    }

    const result = [];
    const subRows = form.find('table tr:not(:has(td.thead,td.tfoot,td.tcat))');
    if (subRows.length > 0) {
      subRows.each(function () {
        const $this = $(this);
        const thread = {};
        thread.id = function getThreadId(t) {
          const a = t.find("a[href*='showthread.php?t=']").eq(0).attr('href').match(/\?t=(\d+)/)[1];
          return a;
        }($this);

        thread.title = function (t) {
          return t.find("a[id^='thread_title']").text();
        }($this);

        thread.lastPage = function (t) {
          const nextTitle = t.find("a[id^='thread_title']").next();
          if (nextTitle.length > 0) {
            const lastPageLink = nextTitle.find('a:last');
            return lastPageLink.attr('href').match(/page=(\d+)/)[1];
          } else {
            return 1;
          }
        }($this);
        result.push(thread);
      });
    } else {
      console.info('There is no subcribed threads');
    }
    return result;
  });
}
