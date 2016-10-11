import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { render } from 'react-dom';
import $ from 'jquery';
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
  }

  componentDidMount() {
    const { dispatch } = this.props;

    Mousetrap.bind('command+r', event => {
      event.preventDefault();

      GET(location.href).then(response => { // eslint-disable-line
        const responseThreadList = $('#threadslist', response);
        const currentThreadList = $('#threadslist');
        currentThreadList.replaceWith(responseThreadList);

        dispatch(getThreadList());
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { threadList, currentView } = nextProps;

    if (currentView === 'thread-list' && threadList.length > 0) {
      threadList.forEach(thread => {
        this.mountThreadPreviewControl(thread);
      });
    }
  }

  mountThreadPreviewControl({ id, pageNum, element }) {
    const threadPreviewDiv = document.createElement('div');
    threadPreviewDiv.id = `thread-preview-${id}`;
    threadPreviewDiv.className = 'thread-preview-wrapper';
    element.append(threadPreviewDiv);
    render(<ThreadPreview id={id} pageNum={pageNum} element={element} />, threadPreviewDiv);
  }

  render() { return null; }
}

const mapStateToProps = state => {
  const { threadList } = state.vozLiving;
  return { threadList };
};

export default connect(mapStateToProps)(ThreadListControl);
