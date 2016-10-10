import { POST } from '../app/utils/http';
import { processQuoteHtml } from '../app/utils/quote';
import {
  getChromeLocalStore,
  setChromeLocalStore,
} from '../app/utils/settings';

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
        quotes.forEach((quote, index) => {
          const existQuote = existQuotes[index];

          if (existQuote) {
            if (!_.isEqual(quote, existQuote)) {
              _.assign(quote, existQuote);
              hasChange = true;
            }
          } else {
            hasChange = true;
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
    getChromeLocalStore().then(settings => {
      const { notifyQuote, delay = 600000, authInfo = {} } = settings;

      if (notifyQuote && !_.isEmpty(authInfo)) {
        this.getQuoteList(authInfo).then(quotes => {
          this.updateQuotes(quotes);
          setTimeout(() => this.checkGetQuotes(), delay);
        });
      } else {
        setTimeout(() => this.checkGetQuotes(), delay);
      }
    });
  }
}

export default QuoteBackground;
