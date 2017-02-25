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
  savePost,
  unsavePost,
} from '../../actions/voz';

class SavedPostThreadBinder extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    savedPosts: PropTypes.object,
  }

  constructor(comProps) {
    super(comProps);
    this.dispatch = comProps.dispatch;
    this.bookmarks = [];
  }

  componentDidMount() {
    $('.voz-postbit').each((i, e) => {
      const $post = $(e);
      try {
        const postId = parseInt($post.attr('id').match(/(\d+)/)[1], 10);
        const $bookmark = $(`<a 
          href="#"
          data-tooltip="Đánh dấu"
          class="voz-living-post-bookmark tooltip-left">
            <i class="fa fa-bookmark" />
          </a>`);
        $bookmark.on('click', this.handleClick.bind(this, postId));
        $post.find('.thead').prepend($bookmark);
        this.bookmarks.push({ $bookmark, postId });
      } catch (er) {
        console.error(er);
        return;
      }
    });
    this.componentWillUpdate(this.props);
  }

  componentWillUpdate(nextProps) {
    const { savedPosts } = nextProps;
    this.bookmarks.forEach(({ $bookmark, postId }) => {
      if (savedPosts[postId]) {
        if (!$bookmark.hasClass('bookmarked')) {
          $bookmark.addClass('bookmarked');
          $bookmark.attr('data-tooltip', 'Bỏ đánh dấu');
        }
      } else {
        if ($bookmark.hasClass('bookmarked')) {
          $bookmark.removeClass('bookmarked');
          $bookmark.attr('data-tooltip', 'Đánh dấu');
        }
      }
    });
  }

  handleClick(postId) {
    if (this.props.savedPosts[postId]) {
      this.dispatch(unsavePost(postId));
    } else {
      this.dispatch(savePost(postId));
    }
    return false;
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => {
  const savedPosts = state.vozLiving.savedPosts;
  return { savedPosts };
};

export default connect(mapStateToProps)(SavedPostThreadBinder);
