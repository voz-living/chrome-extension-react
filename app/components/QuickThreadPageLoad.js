import {
  Component,
  PropTypes,
} from 'react';
import $ from 'jquery';
const cheerio = require('cheerio');

import {
  GET,
} from '../utils/http';

export default class QuickThreadPageLoad extends Component {

  constructor(props) {
    super(props);
    this.hookToNav();
  }

  hookToNav() {
    $('.pagenav a[href*=page]').each((i, e) => {
      const $e = $(e);
      const href = $e[0].href;
      $e.bind('click', this.handlePageLoad.bind(this, href));
    });
  }

  handlePageLoad(href) {
    GET(href)
      .then((html) => {
        const $$ = cheerio.load(html);
        const newTitle = $$('title').text();
        const postsHtml = $$('#posts').html();
        document.querySelector('#posts').innerHTML = postsHtml;
        history.pushState({}, newTitle, href);
        document.title = newTitle;
      });
      return false;
  }

  render() {
    return null;
  }
}
