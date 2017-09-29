import React, { Component, PropTypes } from 'react';
import { GET } from '../utils/http';
import $ from 'jquery';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import Mousetrap from 'mousetrap';
import PostContent from './PostContent';
import {
  subscribeThread,
  unsubscribeThread,
} from '../common/threadSubscription';
import { connect } from 'react-redux';
import * as actions from '../actions/voz';

@autobind
class ThreadPreview extends Component {
  static propTypes = {
    id: PropTypes.string,
    pageNum: PropTypes.number,
    element: PropTypes.any,
    followThreads: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor(comProps) {
    super(comProps);

    this.state = {
      content: '',
      show: false,
      currentPostIndex: null,
      currentPageIndex: null,
      currentHTMLViewPosts: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    this.url = this.getPageUrl();
  }

  getPageUrl(page = 1) {
    return `https://vozforums.com/showthread.php?t=${this.props.id}&page=${page}`;
  }

  getPageByIndex(index = this.state.currentPageIndex) {
    return new Promise(resolve => {
      const { pageNum } = this.props;
      if (index < pageNum) {
        const url = this.getPageUrl(index + 1);
        GET(url).then(response => { // eslint-disable-line
          resolve(response);
        });
      } else {
        resolve(null);
      }
    });
  }

  showPost(postIndex = 0, pageIndex) {
    const { currentPageIndex, currentHTMLViewPosts, show } = this.state;

    if (!show) {
      this.setState({ show: true, isLoading: true });
    } else {
      this.setState({ isLoading: true });
    }

    if (!_.isUndefined(pageIndex) && !_.isNull(pageIndex) && pageIndex !== currentPageIndex) {
      this.loadPosts(pageIndex).then(posts => {
        const pIndex = postIndex === 'last' ? posts.length - 1 : postIndex;
        this.setState({
          currentHTMLViewPosts: posts,
          currentPostIndex: pIndex,
          content: posts.eq(pIndex),
          isLoading: false,
          currentPageIndex: pageIndex,
        });
      });
    } else {
      this.setState({
        currentPostIndex: postIndex,
        content: currentHTMLViewPosts.eq(postIndex),
        isLoading: false,
      });
    }
  }

  viewLastPost() {
    const { pageNum } = this.props;
    const { currentPageIndex, currentHTMLViewPosts } = this.state;

    if (currentPageIndex !== pageNum - 1) {
      this.showPost('last', pageNum - 1);
    } else {
      this.showPost(currentHTMLViewPosts.length - 1, currentPageIndex);
    }
  }

  viewFirstPost() {
    const { currentPageIndex, currentHTMLViewPosts } = this.state;

    if (currentPageIndex !== 0 || currentHTMLViewPosts.length === 0) {
      this.showPost(0, 0);
    } else {
      this.showPost(0, currentPageIndex);
    }
  }

  loadPosts(pageIndex) {
    return new Promise(resolve => {
      this.getPageByIndex(pageIndex).then(response => {
        if (response === null) resolve([]);
        // const posts = $(response).find('[id^="post_message"]');
        const posts = $(response).find('table.voz-postbit');
        resolve(posts);
      });
    });
  }

  openNewTab() {
    window.open(this.url, '_blank');
  }

  closeThreadPreview() {
    Mousetrap.unbind('esc');
    this.setState({ show: false });
    window.vozLivingCurrentThreadPreview = null;
  }

  openThreadPreview() {
    const { currentHTMLViewPosts } = this.state;

    // close other thread preview
    $('.btn-view.active').click();

    Mousetrap.bind('esc', () => {
      this.closeThreadPreview();
    });

    if (currentHTMLViewPosts.length === 0) {
      this.viewFirstPost();
    } else {
      this.setState({ show: true });
    }

    window.vozLivingCurrentThreadPreview = this;
  }

  toggleThreadPreview() {
    const { show, isLoading } = this.state;

    if (!isLoading) {
      if (show) {
        this.closeThreadPreview();
      } else {
        this.openThreadPreview();
      }
    }
  }

  prevPost() {
    const { currentPostIndex, currentPageIndex } = this.state;

    if (currentPostIndex === 0) {
      if (currentPageIndex !== 0) {
        this.showPost('last', currentPageIndex - 1);
      }
    } else {
      if (currentPostIndex > 0) {
        this.showPost(currentPostIndex - 1, currentPageIndex);
      }
    }
  }

  nextPost() {
    const { currentPostIndex, currentPageIndex, currentHTMLViewPosts } = this.state;
    const { pageNum } = this.props;

    if (currentPostIndex === currentHTMLViewPosts.length - 1) {
      if (currentPageIndex < pageNum - 1) {
        this.showPost(0, currentPageIndex + 1);
      }
    } else {
      if (currentPostIndex < currentHTMLViewPosts.length - 1) {
        this.showPost(currentPostIndex + 1, currentPageIndex);
      }
    }
  }

  toggleSubscribeThread() {
    const { currentPostIndex, currentPageIndex, content } = this.state;
    const { followThreads, id, dispatch, element } = this.props;
    if (followThreads[id]) {
      unsubscribeThread(id)
        .then(() => {
          dispatch(actions.unsubscribeThread(id));
        });
    } else {
      const title = $('a[id^="thread_title"]', element).text();
      const postId = content ? $(content).attr('id').replace('post', '') : '';
      const post = {
        threadId: id,
        postId,
        postNum: (currentPageIndex * 10) + currentPostIndex + 1,
        page: currentPageIndex + 1,
        title,
      };
      subscribeThread(id).then(() => {
        dispatch(actions.subscribeThread(id, post));
      });
    }
  }

  renderThreadContent() {
    const { show, isLoading, content, currentPostIndex, currentPageIndex } = this.state;
    const { followThreads, id } = this.props;
    const isFollowed = !!followThreads[id];

    if (!show) return null;

    const remind = 'Sử dụng phím mũi tên <- -> để chuyển post. Phím Esc để đóng khung preview.';

    return (
      <div className="preview-wrapper">
        <div className="left-preview pull-left" style={{ width: 'calc(100% - 45px)' }}>
          <div className="preview-control">{remind}
            <div
              className="btn pull-right btn-next-post tooltip-top"
              onClick={this.nextPost}
              data-tooltip="Xem post sau"
            ><i className="fa fa-arrow-right"></i></div>
            <div
              className="btn pull-right btn-prev-post tooltip-top"
              onClick={this.prevPost}
              data-tooltip="Xem post trước"
            ><i className="fa fa-arrow-left"></i></div>
            <div className="pull-right">
              Post hiện tại: {(currentPageIndex * 10) + currentPostIndex + 1}
            </div>
          </div>
          <div className="preview-content">
            <PostContent html={content} isLoading={isLoading} />
          </div>
        </div>
        <div className="right-preview pull-right">
          <div
            className="btn"
            onClick={this.openNewTab}
            data-tooltip="Mở tab mới"
          ><i className="fa fa-share"></i></div>
          <div
            className="btn"
            onClick={this.viewFirstPost}
            data-tooltip="Xem post đầu tiên"
          ><i className="fa fa-fast-backward"></i></div>
          <div
            className="btn"
            onClick={this.viewLastPost}
            data-tooltip="Xem post cuối cùng"
          ><i className="fa fa-fast-forward"></i></div>
          <div
            className="btn"
            onClick={this.toggleSubscribeThread}
            data-tooltip="Theo dõi thớt"
          >{!isFollowed ?
            <i className="fa fa-check-square-o"></i> : <i className="fa fa-chain-broken"></i>}</div>
        </div>
      </div>
    );
  }

  render() {
    const { show } = this.state;
    let buttonIcon = <i className="fa fa-angle-double-down"></i>;
    let className = 'btn btn-view';

    if (show) {
      buttonIcon = <i className="fa fa-angle-double-up"></i>;
      className += ' active';
    }

    return (
      <div className="thread-preview-inner">
        <div
          className={className}
          onClick={() => this.toggleThreadPreview()}
          data-tooltip="Thread preview"
        >{buttonIcon}</div>
        {this.renderThreadContent()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { followThreads } = state.vozLiving;
  return { followThreads };
};

export default connect(mapStateToProps)(ThreadPreview);
