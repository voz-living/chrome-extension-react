import { POST } from '../app/utils/http';
import { processQuoteHtml } from '../app/utils/quote';
import {
  getChromeLocalStore,
  setChromeLocalStore,
} from '../app/utils/settings';
import _ from 'lodash';

class QuoteBackground {
  constructor() {
    this.hasNotify = false;
    this.checkGetQuotes();

    chrome.runtime.onMessage.addListener((request) => {
      if (request.continueNotify && request.continueNotify === true) this.hasNotify = false;
    });
  }

  getQuoteList(authInfo) {
    return new Promise((resolve) => {
      const { isLogin, username, token, userId } = authInfo;

      if (isLogin) {
        getChromeLocalStore((['settings'])).then(({ settings }) => {
          const { advancedNotifyQuote } = settings;
          const url = 'https://vozforums.com/search.php';
          const formData = new FormData();

          formData.append('do', 'process');
          formData.append('quicksearch', 1);
          formData.append('childforums', 1);
          formData.append('exactname', 1);
          formData.append('securitytoken', token);
          if (advancedNotifyQuote) {
            formData.append('query', `https://${userId}`);
          } else {
            formData.append('query', username);
          }
          formData.append('showposts', 1);

        /* eslint-disable new-cap */
          POST(url, { body: formData }).then(response => {
            processQuoteHtml(response).then(quotes => resolve(quotes));
          }).catch(() => {
            resolve([]);
          });
        });
        /* eslint-enable new-cap */
      } else {
        resolve([]);
      }
    });
  }

  updateQuotes(quotes) {
    let hasChange = false;

    getChromeLocalStore(['quotes']).then(result => {
      const existQuotes = result.quotes;

      if (!existQuotes || existQuotes.length === 0) {
        this.saveQuotes(quotes);
      } else {
        quotes.forEach((quote) => {
          const existQuote = existQuotes.find((eq) => eq.post.id == quote.post.id);

          if (_.isUndefined(existQuote)) {
            hasChange = true;
          } else {
            quote.hasSeen = true;
          }
        });
        if (hasChange) this.saveQuotes(quotes);
      }
    });
  }

  saveQuotes(quotes) {
    setChromeLocalStore({ quotes }).then(() => {
      chrome.tabs.query({ url: '*://vozforums.com/*' }, tabs => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { quotes });
        });
      });

      const hasNotSeen = _.filter(quotes, { hasSeen: false });

      if (hasNotSeen.length > 0 && this.hasNotify === false) {
        chrome.notifications.create('voz-living', {
          type: 'basic',
          title: 'VOZLiving',
          message: `Bạn có ${hasNotSeen.length} quote(s) chưa đọc.`,
          iconUrl: '../assert/icon/64.png',
        }, () => {
          try {
            if (hasNotSeen.length === 1) {
              const handler = () => {
                window.open(`https://vozforums.com/showthread.php?p=${hasNotSeen[0].post.id}#post${hasNotSeen[0].post.id}`, '_blank');
                chrome.notifications.clear('voz-living');
                chrome.notifications.onClicked.removeListener(handler);
              };
              chrome.notifications.onClicked.addListener(handler);
              chrome.notifications.onClosed.removeListener(handler);
            }
          } catch (e) {
            console.log(e);
          }
        });
        this.hasNotify = true;
      }
    });
  }

  checkGetQuotes() {
    console.log('VOZliving check quotes');
    getChromeLocalStore(['authInfo', 'settings']).then(({ settings, authInfo }) => {
      const { notifyQuote, delay = 10 } = settings;
      let intDelay = delay !== '' ? delay : 1;
      intDelay = parseInt(intDelay, 10) > 1 ? parseInt(intDelay, 10) : 1;

      if (notifyQuote && !_.isEmpty(authInfo)) {
        this.getQuoteList(authInfo).then(quotes => {
          this.updateQuotes(quotes);
          setTimeout(() => this.checkGetQuotes(), intDelay * 60 * 1000);
        });
      } else {
        setTimeout(() => this.checkGetQuotes(), intDelay * 60 * 1000);
      }
    });
  }
}

export default QuoteBackground;
