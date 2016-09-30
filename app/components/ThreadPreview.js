import React, { Component, PropTypes } from 'react';
import { GET } from '../utils/http';
import $ from 'jquery';
import { autobind } from 'core-decorators';

class ThreadPreview extends Component {
  static propTypes = {
    id: PropTypes.string,
    pageNum: PropTypes.number,
  }

  constructor(comProps) {
    super(comProps);

    this.state = {
      content: '',
      show: false,
      currentPostIndex: null,
      currentPageIndex: null,
      currentHTMLViewPosts: [],
      firstPageHTML: null,
      lastPageHTML: null,
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
    const { currentPageIndex, currentHTMLViewPosts } = this.state;

    this.setState({ isLoading: true });

    if (!_.isUndefined(pageIndex) && !_.isNull(pageIndex) && pageIndex !== currentPageIndex) {
      this.loadPosts(pageIndex).then(posts => {
        const pIndex = postIndex === 'last' ? posts.length - 1 : postIndex;
        this.setState({
          currentHTMLViewPosts: posts,
          currentPostIndex: pIndex,
          content: posts[pIndex],
          show: true,
          isLoading: false,
          currentPageIndex: pageIndex,
        });
      });
    } else {
      this.setState({
        currentPostIndex: postIndex,
        content: currentHTMLViewPosts[postIndex],
        show: true,
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
        const posts = $(response).find('[id^="post_message"]');
        resolve(posts);
      });
    });
  }

  @autobind
  openNewTab() {
    window.open(this.url, '_blank');
  }

  closeThreadPreview() {
    this.setState({ show: false });
  }

  openThreadPreview() {
    const { currentHTMLViewPosts } = this.state;

    if (currentHTMLViewPosts.length === 0) {
      this.viewFirstPost();
    } else {
      this.setState({ show: true });
    }
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

  @autobind
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

  @autobind
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

  renderThreadContent() {
    const { show, content } = this.state;

    if (!show) return null;

    return (
      <div className="preview-wrapper">
        <div className="left-preview pull-left" style={{ width: 'calc(100% - 45px)' }}>
          <div className="preview-control">
            <div
              className="btn pull-right btn-next-post"
              onClick={this.nextPost}
            >▶</div>
            <div
              className="btn pull-right btn-prev-post"
              onClick={this.prevPost}
            >◀</div>
          </div>
          <div className="preview-content">
            <div dangerouslySetInnerHTML={{ __html: content.innerHTML }}></div>
          </div>
        </div>
        <div className="right-preview pull-right">
          <div
            className="btn btn-open"
            onClick={() => this.openNewTab()}
          >Open</div>
        </div>
      </div>
    );
  }

  render() {
    const { show } = this.state;
    let text = 'View';
    if (show) text = 'Close';

    return (
      <div className="thread-preview-inner">
        <div
          className="btn btn-view"
          onClick={() => this.toggleThreadPreview()}
        >{text}</div>
        {this.renderThreadContent()}
      </div>
    );
  }
}

export default ThreadPreview;
