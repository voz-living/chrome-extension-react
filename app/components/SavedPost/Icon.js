import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  unsavePost,
} from '../../actions/voz';
import LazyPost from './LazyPost';
import openNewTab from '../../utils/openNewTab';
import { toClassName } from '../../utils';

class SavedPostIcon extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    savedPosts: PropTypes.object,
  }

  constructor(comProps) {
    super(comProps);
    this.dispatch = comProps.dispatch;
    this.state = {
      showList: false,
      showFullInfo: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
  }

  openPostInNewTab(postId) {
    openNewTab(`/showthread.php?p=${postId}`);
  }

  unsavePost(postId) {
    this.dispatch(unsavePost(postId));
  }

  renderPost(postId, time) {
    const openInNewTab = this.openPostInNewTab.bind(this, postId);
    const unsavePostClick = this.unsavePost.bind(this, postId);
    return (
      <div className="bookmark-item-wrapper" key={postId}>
        <div className="bookmark-tools">
          <a href="#" className="bookmark-remove" onClick={unsavePostClick}>
            <i className="fa fa-trash" />
          </a>
          <a href="#" className="open-post-new-tab" onClick={openInNewTab}>
            <i className="fa fa-external-link" />
          </a>
        </div>
        <LazyPost postId={postId} />
      </div>
    );
  }

  render() {
    const { savedPosts } = this.props;

    return (
      <div className="btn-group">
        <div
          className={`btn tooltip-right ${(this.state.showList ? 'active' : '')}`}
          onClick={() => this.setState({ showList: !this.state.showList })}
          data-tooltip="Bài đánh dấu"
        >
          <i className="fa fa-bookmark"></i>
        </div>
        {(() => {
          if (this.state.showList) {
            return [
              <div
                key="voz-mask-quote-list"
                className="voz-mask quote-list-mask"
                onClick={() => this.setState({ showList: !this.state.showList })}
              ></div>,
              <div
                className={toClassName({
                  'btn-options': true,
                  'bookmark-list': true,
                  'hide-full-post-info': !this.state.showFullInfo,
                })}
                key="quote-list"
              >
                <h3>Bài viết được đánh dấu</h3>
                <div className="show-full-post-option">
                  <label>
                  Hiện toàn bộ thông tin
                  <input
                    type="checkbox"
                    checked={this.state.showFullInfo}
                    onChange={() => this.setState({ showFullInfo: !this.state.showFullInfo })}
                  />
                  </label>
                </div>
                <div className="quote-list">
                  {Object.keys(savedPosts).map(postId => this.renderPost(parseInt(postId, 10), savedPosts[postId]))}
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

const mapStateToProps = state => {
  const savedPosts = state.vozLiving.savedPosts;
  return { savedPosts };
};

export default connect(mapStateToProps)(SavedPostIcon);
