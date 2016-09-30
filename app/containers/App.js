import React, { Component, PropTypes } from 'react';
import AdsControl from '../components/AdsControl';
import WideScreenControl from '../components/WideScreenControl';
import ThreadListControl from '../components/ThreadListControl';
import { connect } from 'react-redux';
import {
  init,
  getThreadList,
} from '../actions/voz';

class App extends Component {
  static propTypes = {
    currentView: PropTypes.any,
  }

  constructor(comProps) {
    super(comProps);
    const { dispatch } = comProps;
    this.dispatch = dispatch;
  }

  componentDidMount() {
    this.dispatch(init());

    // import css here to avoid null head ;(
    require('../styles/index.less'); // eslint-disable-line
  }

  componentWillReceiveProps(nextProps) {
    const { currentView } = nextProps;

    if (currentView === 'thread-list') {
      this.dispatch(getThreadList());
    }
  }

  render() {
    return (
      <div id="voz-living">
        <AdsControl />
        <WideScreenControl />
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
