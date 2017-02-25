import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  unsavePost,
} from '../../actions/voz';
import LazyPost from './LazyPost';

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
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
  }

  renderPost(postId, time) {
    return (
      <div className="bookmark-item-wrapper" key={postId}>
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
              <div className="btn-options bookmark-list" key="quote-list">
                <h3>Đánh dấu</h3>
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
