import $ from 'jquery';
import {
  getChromeLocalStore,
} from '../../app/utils/settings';

export function processQuoteHtml(html) {
  const htmlOut = html.replace(/[\w_/]+\.gif/g, 'javascript:void(0)');
  const $html = $(htmlOut);
  const data = [];
  const threadsLink = $html.find('td > div > a[href^="showthread"]');

  if (threadsLink.length === 0) return data;
  getChromeLocalStore(['authInfo']).then(({ authInfo }) => {
    const { userId: myId } = authInfo;
    threadsLink.each(function f() {
      try {
        const $this = $(this);
        const tid = $this.attr('href').match(/t=(\d+)/)[1];
        const ttitle = $this.text();
        const $postLink = $this.parents('td:eq(0)')
        .find(" > div > div  a[href^='showthread'][href*='p=']");
        const pid = $postLink.attr('href').match(/p=(\d+)/)[1];
        const ptitle = $postLink.text();
        const $pexcerpt = $postLink.parent();
        $postLink.remove();

        const pexcerpt = $pexcerpt.text().trim();
        const $userA = $this.parents('td:eq(0)').find(" > div > a[href^='member'] ");
        const username = $userA.text();
        const uid = $userA.attr('href').match(/u=(\d+)/)[1];
        const selfQuote = myId === uid;
        const sDatetime = $this.parents('tbody:eq(0)').find(' > tr:eq(0) td')
        .contents().last().text().trim();
        const sDatetimeEs = sDatetime.split(/[-,:]/);
        let datetime = new Date(
        parseInt(sDatetimeEs[2], 10),
        parseInt(sDatetimeEs[1] - 1, 10),
        parseInt(sDatetimeEs[0], 10),
        parseInt(sDatetimeEs[3], 10),
        parseInt(sDatetimeEs[4], 10), 0);

        if (sDatetimeEs.length === 3) {
          const datestr = ['today', 'yesterday'];
          const dateoffset = datestr.indexOf(sDatetimeEs[0].toLowerCase());

          if (dateoffset > -1) {
            const now = new Date();
            const datemod = now.getDate() - dateoffset;
            datetime = new Date(
            parseInt(now.getFullYear(), 10),
            now.getMonth(),
            datemod,
            parseInt(sDatetimeEs[1], 10),
            parseInt(sDatetimeEs[2], 10),
            0);
          }
        }
        data.push({
          author: {
            username,
            userid: uid,
          },
          thread: {
            title: ttitle,
            id: tid,
          },
          post: {
            title: ptitle,
            id: pid,
            content: pexcerpt,
            datetime: datetime.getTime(),
          },
          hasRead: selfQuote,
          hasSeen: selfQuote,
          selfQuote,
        });
      } catch (err) {
        console.log(err);
      }
    });
  });
  return data;
}
