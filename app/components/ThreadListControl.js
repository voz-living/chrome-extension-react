import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { render } from 'react-dom';
import ThreadPreview from './ThreadPreview';

class ThreadListControl extends Component {
  static propTypes = {
    threadList: PropTypes.array,
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
    render(<ThreadPreview id={id} pageNum={pageNum} />, threadPreviewDiv);
  }

  render() { return null; }
}

const mapStateToProps = state => {
  const { threadList, currentView } = state.vozLiving;

  return {
    currentView,
    threadList,
  };
};

export default connect(mapStateToProps)(ThreadListControl);
