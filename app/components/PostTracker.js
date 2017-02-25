import _ from 'lodash';
import $ from 'jquery';
import _inview from 'jquery-inview'; // eslint-disable-line no-unused-vars
import {
  Component,
  PropTypes,
} from 'react';
import {
  connect,
} from 'react-redux';
import {
  updatePostTracker,
} from '../actions/voz';
import postHelper from '../utils/postHelper';

class PostTracker extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  constructor(comProps) {
    super(comProps);
    this.dispatch = comProps.dispatch;
    this.startTrack.call(this);
  }

  startTrack() {
    if (/\/showthread\.php/.test(location.href)) {
      try {
        const postInfo = postHelper($(document.body));
        const threadId = parseInt(postInfo.getThreadId(), 10);
        const threadTitle = postInfo.getThreadTitle();
        if (threadId === -1) return;
        const page = parseInt(postInfo.getPage(), 10);
        const posts = $("table[id^='post']");
        const that = this;
        posts.bind('inview', _.debounce(function (e, isInView) {
          if (!isInView) return;
          const $this = $(this);
          const postId = parseInt($this.attr('id').match(/(\d+)/)[1], 10);
          const postNum = posts.index($this) + 1;
          const post = {
            threadId,
            postId,
            postNum,
            page,
            title: threadTitle,
          };
          that.props.dispatch(updatePostTracker(post));
        }, 300));
      } catch (e) {
        console.error(e);
      }
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps)(PostTracker);
