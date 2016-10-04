import AdsControl from '../components/AdsControl';
import WideScreenControl from '../components/WideScreenControl';
import ThreadListControl from '../components/ThreadListControl';
import LinkHelperControl from '../components/LinkHelperControl';
import SideMenu from '../components/SideMenu';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  init,
  getThreadList,
  getChromeLocalStore,
} from '../actions/voz';

class App extends Component {
  static propTypes = {
    currentView: PropTypes.any,
    settings: PropTypes.object,
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    settings: {},
  }

  componentDidMount() {
    getChromeLocalStore().then(settings => this.props.dispatch(init(settings)));
    // import css here to avoid null head ;(
    require('../styles/index.less'); // eslint-disable-line
  }

  componentWillReceiveProps(nextProps) {
    const { currentView, settings, dispatch } = nextProps;

    if (settings.threadPreview && currentView === 'thread-list') {
      dispatch(getThreadList());
    }
  }

  render() {
    const { wideScreen, adsRemove, linkHelper, dispatch } = this.props.settings;

    return (
      <div id="voz-living">
        <AdsControl isRemoveAds={adsRemove} />
        <WideScreenControl isWideScreen={wideScreen} />
        <LinkHelperControl linkHelper={linkHelper} />
        <ThreadListControl dispatch={dispatch} />
        <SideMenu />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { currentView, settings } = state.vozLiving;
  return { currentView, settings };
};

export default connect(mapStateToProps)(App);
