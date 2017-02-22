import { POST } from '../app/utils/http';
import { processQuoteHtml } from '../app/utils/quote';
import {
  getChromeLocalStore,
  setChromeLocalStore,
} from '../app/utils/settings';
import _ from 'lodash';

class QuoteBackground {
  constructor() {
    this.checkGetQuotes();
  }

  getQuoteList(authInfo) {
    return new Promise((resolve) => {
      const { isLogin, username, token } = authInfo;

      if (isLogin) {
        const url = 'https://vozforums.com/search.php';
        const formData = new FormData();

        formData.append('do', 'process');
        formData.append('quicksearch', 1);
        formData.append('childforums', 1);
        formData.append('exactname', 1);
        formData.append('securitytoken', token);
        formData.append('query', username);
        formData.append('showposts', 1);

        /* eslint-disable new-cap */
        POST(url, { body: formData }).then(response => {
          const quotes = processQuoteHtml(response);
          resolve(quotes);
        }).catch(() => {
          resolve([]);
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
            existQuotes.unshift(quote);
          }
        });
        if (hasChange) this.saveQuotes(quotes);
      }
    });
  }

  saveQuotes(quotes) {
    setChromeLocalStore({ quotes }).then(() => {
      /* eslint-disable no-undef */
      chrome.tabs.query({ url: '*://vozforums.com/*' }, tabs => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { quotes });
        });
      });
      /* eslint-enable no-undef */
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
