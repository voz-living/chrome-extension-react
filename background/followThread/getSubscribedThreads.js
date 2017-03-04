import cheerio from 'cheerio';
import {
  GET,
  headerNoCache,
} from '../../app/utils/http';
/* eslint-disable new-cap */
const SUBSCRIPTION_LINK = 'https://vozforums.com/subscription.php?do=viewsubscription';

export default function getSubscribedThreads() {
  return GET(SUBSCRIPTION_LINK, { headers: headerNoCache }).then((html) => {
    const $$ = cheerio.load(html);
    const $form = $$("form[action*='subscription.php?do=dostuff']");
    if ($form.length === 0) {
      if ($$.find("*:contains('You are not logged in or you do not have permission to access this page')").length > 0) {
        console.info('Loged In = false');
      }
      return false;
    }

    const result = [];
    const subRows = $form.find('table tr:not(:has(td.thead,td.tfoot,td.tcat))');
    if (subRows.length > 0) {
      subRows.each((i, e) => {
        const $e = $$(e);
        const thread = {};
        thread.id = $e.find("a[href*='showthread.php?t=']").eq(0).attr('href').match(/\?t=(\d+)/)[1];

        thread.title = $e.find("a[id^='thread_title']").text()

        thread.lastPage = ((t) => {
          const nextTitle = t.find("a[id^='thread_title']").next();
          if (nextTitle.length > 0) {
            const lastPageLink = nextTitle.find('a').last();
            return lastPageLink.attr('href').match(/page=(\d+)/)[1];
          }
          return 1;
        })($e);
        result.push(thread);
      });
    } else {
      console.info('There is no subcribed threads');
    }
    return result;
  });
}
