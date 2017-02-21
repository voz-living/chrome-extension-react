import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import AdsControl from '../components/AdsControl';
import WideScreenControl from '../components/WideScreenControl';
import ThreadListControl from '../components/ThreadListControl';
import LinkHelperControl from '../components/LinkHelperControl';
import ThreadControl from '../components/ThreadControl';
import EmotionControl from '../components/EmotionControl';
import MinimizeQuoteControl from '../components/MinimizeQuoteControl';
import QuickPostQuotationControl from '../components/QuickPostQuotationControl';
import PostTracker from '../components/PostTracker';
import SideMenu from './SideMenu';

import {
  init,
  getThreadList,
  updateQuotes,
} from '../actions/voz';

import {
  getChromeLocalStore,
  setChromeLocalStore,
} from '../utils/settings';

import {
  getCurrentView,
  getAuthenticationInformation,
} from '../utils';

import postHelper from '../utils/postHelper';

class App extends Component {
  static propTypes = {
    settings: PropTypes.object,
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    settings: {},
  }

  constructor(comProps) {
    super(comProps);
    this.dispatch = comProps.dispatch;
    this.currentView = getCurrentView();
    this.authInfo = getAuthenticationInformation();
  }

  componentDidMount() {
    const postInfo = postHelper($(document.body));

    getChromeLocalStore([
      'settings', 'quotes', 'authInfo',
      'quickLinks', 'followThreads', 'threadTracker',
    ]).then(({
      quotes, settings, authInfo,
      quickLinks, followThreads, threadTracker,
    }) => {
      const misc = {};
      misc.currentView = this.currentView;
      if (misc.currentView === 'thread') {
        misc.threadId = postInfo.getThreadId();
      }

      this.props.dispatch(init(settings, quotes, quickLinks, followThreads, threadTracker, misc));

      if (settings.threadPreview === true && this.currentView === 'thread-list') {
        this.props.dispatch(getThreadList());
      }

      if (_.isEmpty(authInfo) || !_.isEqual(authInfo, this.authInfo)) {
        setChromeLocalStore({ authInfo: this.authInfo });
      }
    });

    /* eslint-disable no-undef */
    chrome.runtime.onMessage.addListener((request) => {
      if (request.quotes) this.dispatch(updateQuotes(request.quotes));
    });
    /* eslint-enable no-undef */
    window.vozLivingLoader.stop();
  }

  render() {
    const { wideScreen, adsRemove, linkHelper, emotionHelper,
      minimizeQuote, quickPostQuotation } = this.props.settings;

    return (
      <div id="voz-living">
        <AdsControl isRemoveAds={adsRemove} />
        <WideScreenControl isWideScreen={wideScreen} />
        <PostTracker dispatch={this.dispatch} />
        <LinkHelperControl linkHelper={linkHelper} currentView={this.currentView} />
        <ThreadListControl dispatch={this.dispatch} currentView={this.currentView} />
        <ThreadControl currentView={this.currentView} />
        <EmotionControl currentView={this.currentView} emotionHelper={emotionHelper} />
        <MinimizeQuoteControl isMinimizeQuote={minimizeQuote} currentView={this.currentView} />
        <QuickPostQuotationControl
          isQuickPostQuotation={quickPostQuotation} currentView={this.currentView}
        />
        <SideMenu dispatch={this.dispatch} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { settings } = state.vozLiving;
  return { settings };
};

export default connect(mapStateToProps)(App);
