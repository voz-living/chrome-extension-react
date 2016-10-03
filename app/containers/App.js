import React, { Component, PropTypes } from 'react';
import AdsControl from '../components/AdsControl';
import WideScreenControl from '../components/WideScreenControl';
import ThreadListControl from '../components/ThreadListControl';
import { connect } from 'react-redux';
import {
  init,
  getThreadList,
  getChromeLocalStore,
} from '../actions/voz';

class App extends Component {
  static propTypes = {
    currentView: PropTypes.any,
  }

  constructor(comProps) {
    super(comProps);
    const { dispatch } = comProps;
    this.dispatch = dispatch;

    this.state = {
      wideScreen: false,
      adsRemove: false,
    };
  }

  componentDidMount() {
    this.dispatch(init());

    // import css here to avoid null head ;(
    require('../styles/index.less'); // eslint-disable-line
  }

  componentWillReceiveProps(nextProps) {
    const { currentView } = nextProps;

    getChromeLocalStore().then(allSettings => {
      this.setState({ wideScreen: allSettings.wideScreen });
      this.setState({ adsRemove: allSettings.adsRemove });

      if (currentView === 'thread-list') {
        if (allSettings.threadPreview) this.dispatch(getThreadList());
      }
    });
  }

  render() {
    const { wideScreen, adsRemove } = this.state;

    return (
      <div id="voz-living">
        <AdsControl isRemoveAds={adsRemove} />
        <WideScreenControl isWideScreen={wideScreen} />
        <ThreadListControl dispatch={this.dispatch} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { currentView } = state.vozLiving;
  return { currentView };
};

export default connect(mapStateToProps)(App);
