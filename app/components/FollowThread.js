import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  markAllQuoteSeen,
} from '../actions/voz';

class FollowThread extends Component {
  static propTypes = {
    settings: PropTypes.object,
    dispatch: PropTypes.func,
    threadList: PropTypes.array, // { id, postId, numPostDiff, numPostFromTracker, numPost, title }
  }

  static defaultProps = {
    threadList: [],
    settings: {},
  }

  constructor(comProps) {
    super(comProps);

    this.state = {
      showThreadList: false,
    };
    this.dispatch = comProps.dispatch;
  }

  getTime(timeStamp) {
    const date = new Date(timeStamp);
    /* eslint-disable max-len */
    return `${date.getHours()}:${date.getMinutes()} ${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    /* eslint-enable max-len */
  }

  toggleThreadList() {
    const { showThreadList } = this.state;
    // const { countUnseen } = this.props;

    // if (showThreadList === false && countUnseen !== 0) {
    //   this.dispatch(markAllQuoteSeen());
    // }
    this.setState({ showThreadList: !showThreadList });
  }

  renderThread(thread) {
    const { id, postId, numPostDiff, numPostFromTracker, numPostTotal, title } = thread;
    const link = postId === null 
      ? `showthread.php?t=${id}`
      : `showthread.php?p=${postId}#post${postId}`;
    return (
      <div className="quote-row" key={id}>
        <div className="quote-title">
          <a href={link}>
            {title}
          </a>
          <a
            className="pull-right" target="_blank"
            href={link}
            title="Mở ra trong tab mới"
          >
            <i className="fa fa-share"></i>
          </a>
        </div>
        <div className="quote-bottom">
          <i className="fa fa-arrow-right"></i> Có {numPostDiff} bài mới
        </div>
      </div>
    );
  }

  render() {
    const { threadList } = this.props;
    const renderThread = this.renderThread;
    console.log(threadList);

    return (
      <div className="btn-group">
        <div
          className="btn"
          onClick={() => this.toggleThreadList()}
        >
          <i className="fa fa-th-list"></i>
        </div>
        {(() => {
          if (this.state.showThreadList) {
            return [
              <div
                key="voz-mask-quote-list"
                className="voz-mask quote-list-mask"
                onClick={() => this.setState({ showThreadList: !this.state.showThreadList })}
              ></div>,
              <div className="btn-options" key="quote-list">
                <h3>Subscribed Threads</h3>
                <div className="quote-list">
                  {threadList.map(renderThread)}
                </div>
              </div>,
            ];
          }
          return null;
        })()}
      </div>
    );
  }
}

function estimateSubscribedThreads(followThreads, threadTracker) {
  if (_.isEmpty(followThreads) || _.isEmpty(threadTracker)) return [];
  return Object.keys(followThreads).map((id) => {
    const { page, postNum, title } = followThreads[id];
    const tracked = threadTracker[id];
    const postId = tracked ? tracked.postId : null;
    const numPostFromTracker = tracked ? tracked.page * 10 + tracked.postNum : 0;
    const numPostTotal = page * 10 + postNum;
    const numPostDiff = numPostTotal - numPostFromTracker;
    return { id, postId, numPostDiff, numPostFromTracker, numPostTotal, title };
  });
}

const mapStateToProps = state => {
  const { followThreads, settings, threadTracker } = state.vozLiving;
  return { threadList: estimateSubscribedThreads(followThreads, threadTracker), settings };
};

export default connect(mapStateToProps)(FollowThread);
