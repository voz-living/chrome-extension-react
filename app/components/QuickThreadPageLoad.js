import {
  Component,
  PropTypes,
} from 'react';
import $ from 'jquery';

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

  }

  render() {
    return null;
  }
}
