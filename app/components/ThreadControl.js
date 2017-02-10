import { Component, PropTypes } from 'react';
import $ from 'jquery';
import Mousetrap from 'mousetrap';

class ThreadControl extends Component {
  static propTypes = {
    currentView: PropTypes.string,
  }

  componentDidMount() {
    const { currentView } = this.props;

    if (currentView === 'thread') {
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
          window.location.href = href;
        }
      });
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind('left');
    Mousetrap.unbind('right');
  }

  render() { return null; }
}

export default ThreadControl;
