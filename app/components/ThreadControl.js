import { Component, PropTypes } from 'react';
import $ from 'jquery';
import Mousetrap from 'mousetrap';
import _ from 'lodash';

class ThreadControl extends Component {
  static propTypes = {
    currentView: PropTypes.string,
  }

  componentDidMount() {
    const { currentView } = this.props;

    if (currentView === 'thread') {
      $('.pagenav > table > tbody > tr')
        .prepend(`<td class="voz-living-arrow-nav-help">
        Dùng phím mũi tên <- và -> để chuyển trang
        </td>`);
      Mousetrap.bind('right', () => {
        const next = $('a[rel="next"]');
        if (next) {
          const href = next.eq(0).attr('href');
          if (!_.isUndefined(href)) window.location.href = href;
        }
      });

      Mousetrap.bind('left', () => {
        const prev = $('a[rel="prev"]');
        if (prev) {
          const href = prev.eq(0).attr('href');
          if (!_.isUndefined(href)) window.location.href = href;
        }
      });
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind(['left', 'right']);
  }

  render() { return null; }
}

export default ThreadControl;
