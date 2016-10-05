import AdsControl from '../components/AdsControl';
import WideScreenControl from '../components/WideScreenControl';
import ThreadListControl from '../components/ThreadListControl';
import LinkHelperControl from '../components/LinkHelperControl';
import SideMenu from './SideMenu';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  init,
  getThreadList,
  getChromeLocalStore,
} from '../actions/voz';
import { getCurrentView } from '../utils';

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
    this.currentView = getCurrentView();
  }

  componentDidMount() {
    // import css here to avoid null head ;(
    require('../styles/index.less'); // eslint-disable-line

    getChromeLocalStore().then(settings => {
      this.props.dispatch(init(settings));

      if (settings.threadPreview === true && this.currentView === 'thread-list') {
        this.props.dispatch(getThreadList());
      }
    });
  }

  render() {
    const { settings } = this.props;
    const { wideScreen, adsRemove, linkHelper, dispatch } = settings;

    return (
      <div id="voz-living">
        <AdsControl isRemoveAds={adsRemove} />
        <WideScreenControl isWideScreen={wideScreen} />
        <LinkHelperControl linkHelper={linkHelper} />
        <ThreadListControl dispatch={dispatch} currentView={this.currentView} />
        <SideMenu dispatch={dispatch} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { currentView, settings } = state.vozLiving;
  return { currentView, settings };
};

export default connect(mapStateToProps)(App);
