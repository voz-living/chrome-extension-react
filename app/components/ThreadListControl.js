import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { render } from 'react-dom';
import $ from 'jquery';
import _ from 'lodash';
import ThreadPreview from './ThreadPreview';
import Mousetrap from 'mousetrap';
import { GET } from '../utils/http';
import {
  getThreadList,
} from '../actions/voz';

class ThreadListControl extends Component {
  static propTypes = {
    threadList: PropTypes.array,
    dispatch: PropTypes.func,
    currentView: PropTypes.string,
    isThreadPreview: PropTypes.bool,
  }

  componentDidMount() {
    const { dispatch, currentView } = this.props;

    if (currentView === 'thread-list') {
      Mousetrap.bind(['command+r', 'ctrl+r'], event => {
        event.preventDefault();

        GET(location.href).then(response => { // eslint-disable-line
          const responseThreadList = $('#threadslist', response);
          const currentThreadList = $('#threadslist');
          currentThreadList.replaceWith(responseThreadList);

          dispatch(getThreadList());
        });
      });

      Mousetrap.bind('left', () => {
        if (!window.vozLivingCurrentThreadPreview) {
          const prev = $('a[rel="prev"]');
          if (prev) {
            const href = prev.eq(0).attr('href');
            if (!_.isUndefined(href)) window.location.href = href;
          }
        } else {
          // control thread preview prev
          window.vozLivingCurrentThreadPreview.prevPost();
        }
      });

      Mousetrap.bind('right', () => {
        if (!window.vozLivingCurrentThreadPreview) {
          const next = $('a[rel="next"]');
          if (next) {
            const href = next.eq(0).attr('href');
            if (!_.isUndefined(href)) window.location.href = href;
          }
        } else {
          // control thread preview next
          window.vozLivingCurrentThreadPreview.nextPost();
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { threadList, currentView, isThreadPreview } = nextProps;

    if (currentView === 'thread-list' && threadList.length > 0 && isThreadPreview) {
      threadList.forEach(thread => {
        this.mountThreadPreviewControl(thread);
        this.mountOpenNewTabControl(thread);
      });
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind(['left', 'right', 'command+r', 'ctrl+r']);
  }

  mountThreadPreviewControl({ id, pageNum, element }) {
    const threadPreviewDiv = document.createElement('div');
    threadPreviewDiv.id = `thread-preview-${id}`;
    threadPreviewDiv.className = 'thread-preview-wrapper';
    element.append(threadPreviewDiv);
    render(<ThreadPreview id={id} pageNum={pageNum} element={element} />, threadPreviewDiv);
  }

  mountOpenNewTabControl({ id, element }) {
    const $link = element.find(`a[id=thread_title_${id}]`);
    const href = $link[0].href;
    $link.after(`<a 
      class="voz-living-newtab tooltip-bottom" 
      href="${href}"
      data-tooltip="Mở tab mới"
      target="_blank">
        &nbsp;&nbsp;&nbsp;<i class="fa fa-external-link"/>&nbsp;&nbsp;&nbsp;
      </a>`);
  }

  render() { return null; }
}

const mapStateToProps = state => {
  const { threadList } = state.vozLiving;
  return { threadList };
};

export default connect(mapStateToProps)(ThreadListControl);
