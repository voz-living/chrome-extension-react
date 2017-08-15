import React, {
  Component,
  PropTypes,
} from 'react';
import { connect, Provider } from 'react-redux';
import $ from 'jquery';
import { toClassName } from '../utils';
import { GET } from '../utils/http';
import postHelper from '../utils/postHelper';
import { insertTextIntoEditor } from '../common/editor';
import { setConfig } from '../../options/ConfigItem';
import { getConfig } from '../../options/OptionPage';
import { increasePageStatusId } from '../actions/voz';

let threadId;
const genUrl = (page) => `https://vozforums.com/showthread.php?t=${threadId}&page=${page}`;
const _c = (e) => document.createElement(e);
// const _t = document.createTextNode;
const getNextPageDiv = (props) => {
  const w = _c('div');
  w.id = 'page-control-next-end';
  w.innerHTML = 'Load Next Page (HotKey: Phím →)';
  document.querySelector('#lastpost').parentNode.appendChild(w);
  w.addEventListener('click', props.onClick);
  return w;
};
const getPreviousPageDiv = (props) => {
  const w = _c('div');
  w.id = 'page-control-prev-top';
  w.innerHTML = 'Load Previous Page (Hotkey: Phím ←)';
  document.querySelector('#posts').parentElement.insertBefore(w, document.querySelector('#posts'));
  w.addEventListener('click', props.onClick);
  return w;
};

const getPageNumState = ($html) => {
  const state = {
    pageNum: 1,
    pageCurrent: 1,
    isLoading: false,
  };
  if ($html.find('.pagenav .vbmenu_control').length > 0) {
    const matches = $html.find('.pagenav .vbmenu_control').eq(0).text().trim().match(/Page +(\d+) +of +(\d+)/);
    if (matches && matches.length > 2) {
      state.pageNum = parseInt(matches[2], 10);
      state.pageCurrent = parseInt(matches[1], 10);
    }
  }
  return state;
};

const loadPage = (page) => {
  const url = genUrl(page);
  return GET(url)
    .then((html) => {
      const $html = $(html);
      const posts = $html.find('#posts > div');
      const pageState = getPageNumState($html);
      return { posts, pageState, url };
    });
};

class UIRevampThread extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  constructor(props) {
    super(props); // enable

    this.state = {
      status: null, /* processing, text, copied, cancel */
      text: '',
    };
  }

  componentDidMount() {
    if (this.props.enable === true) {
      require('../styles/thread-ui.less');
      threadId = postHelper($(document.body)).getThreadId();
      getNextPageDiv({ onClick: this.clickNext });
      getPreviousPageDiv({ onClick: this.clickPrevious });
      this.init();
      window.__goNextPage = this.clickNext.bind(this);
      window.__goPreviousPage = this.clickPrevious.bind(this);
    } else {
      this.addRecommend();
    }
  }

  addRecommend() {
    const posts = document.querySelector("#posts");
    const $btn = $('<a href="#" style="color: white;font-size: 14px;font-weight: bold;text-shadow: 0px 0px 2px black">Kích hoạt giao diện mới cho trang xem thớt</a>');
    // console.log($(posts.previousElementSibling));
    // console.log($(posts.previousElementSibling).find('.tcat > div'));
    $(posts.previousElementSibling).find('.tcat > div').append($btn);
    $btn.bind('click', () => {
      getConfig()
        .then(config => {
          return setConfig('newThreadUI', true, config)
        })
        .then(() => {
          window.location.href = window.location.href + '#newThreadUIFirstEnable';
          location.reload();
        });
    });
  }

  disableNavigationControl() {
    document.querySelector('#page-control-prev-top').classList.add('hide-nav');
    document.querySelector('#page-control-next-end').classList.add('hide-nav');
  }

  goToPage(page) {
    this.setState({ isLoading: true })
    this.disableNavigationControl();
    return loadPage(page)
      .then(({ posts, pageState, url }) => {
        window.history.replaceState(null, window.document.title.replace(/Page \d+/, '') + ` - Page ${page}`, url);
        this.setState({ isLoading: false, ...pageState }, () => {
          this.updateOffElements();
        });
        return posts;
      });
  }

  clickPrevious = (e) => {
    const nextPage = Math.max(1, this.state.pageCurrent - 1);
    if (nextPage === this.state.pageCurrent) return false;
    this.goToPage(nextPage)
      .then(posts => {
        $('#posts').empty();
        $('#posts').prepend(posts);
        setTimeout(() => window.scrollTo(0, 0), 100);
        if (window.__postTrackerSetup) window.__postTrackerSetup();
        setTimeout(() => this.props.dispatch(increasePageStatusId()), 200);
      });
    e.preventDefault();
    return false;
  }
  clickNext = (e) => {
    const nextPage = Math.min(this.state.pageCurrent + 1, this.state.pageNum);
    if (nextPage === this.state.pageCurrent) return false;
    this.goToPage(nextPage)
      .then(posts => {
        $('#posts').empty();
        $('#posts').append(posts);
        setTimeout(() => window.scrollTo(0, 0), 100);
        if (window.__postTrackerSetup) window.__postTrackerSetup();
        setTimeout(() => this.props.dispatch(increasePageStatusId()), 200);
      });
    e.preventDefault();
    return false;
  }
  clickFirst = (e) => {
    const nextPage = 1;
    if (nextPage === this.state.pageCurrent) return false;
    this.goToPage(nextPage)
      .then(posts => {
        $('#posts').empty();
        $('#posts').prepend(posts);
        setTimeout(() => window.scrollTo(0, 0), 100);
        if (window.__postTrackerSetup) window.__postTrackerSetup();
        setTimeout(() => this.props.dispatch(increasePageStatusId()), 200);
      });
    e.preventDefault();
    return false;
  }
  clickLast = (e) => {
    const nextPage = this.state.pageNum;
    if (nextPage === this.state.pageCurrent) return false;
    this.goToPage(nextPage)
      .then(posts => {
        $('#posts').empty();
        $('#posts').append(posts);
        setTimeout(() => window.scrollTo(0, 0), 100);
        if (window.__postTrackerSetup) window.__postTrackerSetup();
        setTimeout(() => this.props.dispatch(increasePageStatusId()), 200);
      });
    e.preventDefault();
    return false;
  }
  goToAny = (e) => {
    const nextPage = window.prompt('Go to page ?', 1);
    if (nextPage === this.state.pageCurrent) return false;
    this.goToPage(nextPage)
      .then(posts => {
        $('#posts').empty();
        $('#posts').append(posts);
        setTimeout(() => window.scrollTo(0, 0), 100);
        if (window.__postTrackerSetup) window.__postTrackerSetup();
        setTimeout(() => this.props.dispatch(increasePageStatusId()), 200);
      });
    return false;
    e.preventDefault();
  }

  init = () => {
    const state = {
      pageNum: 1,
      pageCurrent: 1,
    };
    const $reply = $('form[action^="newreply.php?do=postreply"]');
    $reply.attr('id', 'quick_reply');
    this.$replyBox = $reply;

    // custom click event
    const $toggle = $reply.find('[onclick*="toggle_collapse(\'quickreply\')"]');
    $toggle.attr('onclick', '');
    $toggle.bind('click', (e) => {
      e.stopPropagation();
      if (!$reply.hasClass('expand')) {
        $reply.addClass('expand');
      } else {
        $reply.removeClass('expand');
      }
      return false;
    });
    // remove noises
    document.querySelectorAll('#lastpost + div > div > div >*:not(form):not(.vbmenu_popup)').forEach(e => e.remove())
    document.querySelector('form[action="index.php"]:not([id=pagenav_form])').remove();
    // get page num
    Object.assign(state, getPageNumState($(document.body)));
    // continue remove noises
    document.querySelector('#neo_logobar').parentNode.remove();
    document.querySelector('#poststop + table').style.display = 'none';
    //
    const topBar = document.createElement('div');
    topBar.id = 'voz_living_top_bar';
    document.body.appendChild(topBar);
    const _tmp = document.querySelector('div.page > div');
    _tmp.querySelector('div').remove();
    _tmp.querySelector('br').remove();
    topBar.appendChild(_tmp.querySelector('*:not(#page-control-prev-top)'));
    topBar.appendChild(_tmp.querySelector('*:not(#page-control-prev-top)'));
    let prev = document.querySelector('#posts').previousElementSibling;
    if (prev.id === 'page-control-prev-top') prev = prev.previousElementSibling;
    topBar.appendChild(prev);
    this.setState(state, () => {
      this.updateOffElements();
    });
  }

  updateOffElements() {
    const { pageNum, pageCurrent } = this.state;
    if (pageNum > 1) {
      if (pageCurrent > 1) {
        document.querySelector('#page-control-prev-top').classList.remove('hide-nav');
      } else {
        document.querySelector('#page-control-prev-top').classList.add('hide-nav');
      }
      if (pageCurrent < pageNum) {
        document.querySelector('#page-control-next-end').classList.remove('hide-nav');
      } else {
        document.querySelector('#page-control-next-end').classList.add('hide-nav');
      }
    } else {
      $('#page-control-prev-top, #page-control-next-end').css('visbility', 'hidden');
    }
  }

  renderPreviousControl() {
    const { pageNum, pageCurrent } = this.state;
    if (pageCurrent > 1) {
      return <a href={genUrl(pageCurrent - 1)} className="page-previous" onClick={this.clickPrevious}>▲</a>;
    }
    return null;
  }
  renderNextControl() {
    const { pageNum, pageCurrent } = this.state;
    if (pageCurrent < pageNum) {
      return <a href={genUrl(pageCurrent + 1)} className="page-next" onClick={this.clickNext}>▼</a>;
    }
    return null;
  }
  renderFirstControl() {
    const { pageNum, pageCurrent } = this.state;
    if (pageCurrent > 2) {
      return <a href={genUrl(1)} className="page-first" onClick={this.clickFirst}>⤒</a>;
    }
    return null;
  }
  renderLastControl() {
    const { pageNum, pageCurrent } = this.state;
    if (pageCurrent < pageNum - 1) {
      return <a href={genUrl(pageNum)} className="page-last" onClick={this.clickLast}>⤓</a>;
    }
    return null;
  }

  render() {
    const { pageNum, pageCurrent, isLoading } = this.state;
    const pageProgress = (pageCurrent - 1) / (pageNum - 1) * 100;
    return (
      <div className={'page-control-bar' + (isLoading ? ' disabled' : '')}>
        <span style={{ display: 'none' }} id="meta_page_current" value={pageCurrent}></span>
        <div 
          className="current-page-control"
          ref={(e) => { this.$curPage = e; }}
          style={{ top: `${pageProgress}%` }}
        >
          {this.renderFirstControl()}
          {this.renderPreviousControl()}
          <div className="current-page-label">
            {isLoading 
              ? <i className="fa fa-spin fa-spinner"></i> 
              : <a onClick={this.goToAny} className="tooltip-left" data-tooltip="Đi đến trang ...">{pageCurrent}</a>} / {pageNum}
          </div>
          {this.renderNextControl()}
          {this.renderLastControl()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state.vozLiving;
};

export default connect(mapStateToProps)(UIRevampThread);
