import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import _ from 'lodash';

import AdsControl from '../components/AdsControl';
import WideScreenControl from '../components/WideScreenControl';
import ThreadListControl from '../components/ThreadListControl';
import LinkHelperControl from '../components/LinkHelperControl';
import ThreadControl from '../components/ThreadControl';
import EmotionControl from '../components/EmotionControl';
import MinimizeQuoteControl from '../components/MinimizeQuoteControl';
import QuickPostQuotationControl from '../components/QuickPostQuotationControl';
import PostTracker from '../components/PostTracker';
import QuickBanUser from '../components/QuickBanUser';
import PasteToUpload from '../components/PasteToUpload';
import SmartSelection from '../components/SmartSelection';
// import UIRevampThread from '../components/UIRevampThread';
import UserStyle from '../components/UserStyle';
import SavedPostThreadBinder from '../components/SavedPost/ThreadBinder';
import CapturePost from '../components/CapturePost';
import StickerPicker from '../components/StickerPicker';
import RichEditor from '../components/RichEditor';
import SideMenu from './SideMenu';

import {
  init,
  getThreadList,
  updateQuotes,
} from '../actions/voz';

import {
  getChromeLocalStore,
  getChromeSyncStore,
  setChromeLocalStore,
  defaultStoreStructure,
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

    switch (this.currentView) {
      case 'thread': {
        const postInfo = postHelper($(document.body));
        trackEvent('view-thread-id', postInfo.getThreadId());
        trackEvent('view-thread-title', postInfo.getThreadTitle());
        trackEvent('view-thread-combine', postInfo.getThreadId() + ':|:' + postInfo.getThreadTitle());
        break;
      }
      case 'thread-list': {
        try {
          const f = window.location.href.match(/f=(\d+)/)[1];
          trackEvent('view-forum', f);
        } catch (e) {
          console.error(e);
        }
        break;
      }
    }
  }

  componentDidMount() {
    const postInfo = postHelper($(document.body));
    setTimeout(() => {
      document.querySelector('.voz-living-side-menu').classList.remove('trans-start');
    }, 1000);

    Promise.all([
      getChromeLocalStore([
        'settings', 'quotes', 'authInfo',
        'quickLinks', 'followThreads', 'threadTracker',
      ]),
      getChromeSyncStore([
        'savedPosts',
      ]),
    ])
    .then(([storage, syncStore]) => {
      const {
        settings: _settings, authInfo,
      } = storage;
      const settings = {
        ...defaultStoreStructure.settings,
        ..._settings,
      };
      const misc = {};
      misc.currentView = this.currentView;
      if (misc.currentView === 'thread') {
        misc.threadId = postInfo.getThreadId();
      }
      storage.settings = settings; // eslint-disable-line
      this.props.dispatch(init({ ...storage, ...syncStore, misc }));

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

  renderBaseOnCurrentView(currentView) {
    const settings = (_.isEmpty(this.props.settings)) ? {} : {
      ...defaultStoreStructure.settings,
      ...this.props.settings,
    };
    const {
      linkHelper,
      minimizeQuote,
      quickPostQuotation,
      threadPreview,
      savePostEnable,
      capturePostEnable,
      newThreadUI,
      smartSelection,
      stickerPanelExpand,
      enableRichEditor,
    } = settings;
    let { pageStatusId } = this.props;
    if (typeof linkHelper === 'undefined') pageStatusId = -1;
    if (currentView === 'thread-list') {
      return [
        <ThreadListControl
          key="voz-living-thread-list-control"
          dispatch={this.dispatch} currentView={this.currentView} isThreadPreview={threadPreview}
          autoGotoNewthread={this.props.settings.autoGotoNewthread}
        />,
      ];
    } else if (currentView === 'thread') {
      return [
        <LinkHelperControl linkHelper={linkHelper} pageStatusId={pageStatusId} key="voz-living-link-helper" />,
        <ThreadControl currentView={this.currentView} key="voz-living-thread-control" />,
        <MinimizeQuoteControl
          isMinimizeQuote={minimizeQuote} key="voz-living-minimize-quote-control"
        />,
        <QuickPostQuotationControl
          isQuickPostQuotation={quickPostQuotation} key="voz-living-quick-post-control"
        />,
        smartSelection && <SmartSelection key="smart-selection" />,
        // (typeof newThreadUI !== 'undefined')
        //   && <UIRevampThread key="ui-revamp-thread" enable={newThreadUI} />,
        !_.isUndefined(enableRichEditor) 
          && (enableRichEditor ? <RichEditor stickerPanelExpand={stickerPanelExpand} /> : <RichEditor.Recommendation />),
        <QuickBanUser key="voz-living-quick-ban-user" />,
        savePostEnable ? <SavedPostThreadBinder dispatch={this.dispatch} pageStatusId={pageStatusId} key="saved-post-thread-binder" /> : null,
        capturePostEnable ? <CapturePost key="capture-post" /> : null,
      ];
    } else if (currentView === 'post') {
      return [
        <LinkHelperControl linkHelper={linkHelper} pageStatusId={pageStatusId} key="voz-living-link-helper" />,
        <QuickBanUser key="voz-living-quick-ban-user" />,
        savePostEnable ? <SavedPostThreadBinder dispatch={this.dispatch} pageStatusId={pageStatusId} key="saved-post-thread-binder" /> : null,
        capturePostEnable ? <CapturePost key="capture-post" /> : null,
        <div style={{ display: 'none' }}><StickerPicker /></div>,
      ];
    }
    return null;
  }

  render() {
    const { wideScreenSpecial, adsRemove, emotionHelper, autoHideSidebar, userStyle, stickerPanelExpand, enableRichEditor } = this.props.settings;

    return (
      <div id="voz-living">
        <AdsControl isRemoveAds={adsRemove} />
        <WideScreenControl isWideScreen={wideScreenSpecial} />
        <PostTracker dispatch={this.dispatch} />
        {this.currentView === 'thread'
          ? !_.isUndefined(enableRichEditor) && enableRichEditor === false && <EmotionControl currentView={this.currentView} emotionHelper={emotionHelper} stickerPanelExpand={stickerPanelExpand} />
          : !_.isUndefined(emotionHelper) && emotionHelper === true && <EmotionControl currentView={this.currentView} emotionHelper={emotionHelper} stickerPanelExpand={stickerPanelExpand} />
        }
        <SideMenu
          dispatch={this.dispatch}
          settings={this.props.settings}
          autoHide={autoHideSidebar}
        />
        {this.renderBaseOnCurrentView(this.currentView)}
        <PasteToUpload />
        <UserStyle userStyle={userStyle} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { settings, pageStatusId } = state.vozLiving;
  return { settings, pageStatusId };
};

export default connect(mapStateToProps)(App);
