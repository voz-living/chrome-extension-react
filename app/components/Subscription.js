import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import {
  autobind
} from 'core-decorators';
import { connect } from 'react-redux';
import { getCurrentView } from '../utils';
import {
  subscribeThread,
  unsubscribeThread,
} from '../common/threadSubscription';

import * as actions from '../actions/voz';

@autobind
class ReloadButton extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    isSubscribed: PropTypes.bool,
    isThreadView: PropTypes.bool,
    threadId: PropTypes.any,
    currentPost: PropTypes.object,
  }

  constructor(comProps) {
    super(comProps);
    this.view = getCurrentView();
    this.state = {
      isLoading: false,
    };
  }

  subscribe() {
    this.setState({ isLoading: true });
    subscribeThread(this.props.threadId)
      .then(() => {
        this.props.dispatch(actions.subscribeThread(this.props.threadId, this.props.currentPost));
        this.setState({ isLoading: false });
      });
  }

  unsubscribe() {
    this.setState({ isLoading: true });
    unsubscribeThread(this.props.threadId)
      .then(() => {
        this.props.dispatch(actions.unsubscribeThread(this.props.threadId));
        this.setState({ isLoading: false });
      });
  }

  render() {
    if (this.props.isThreadView) {
      return (
        <div className="btn-group">
          {this.state.isLoading
          ? <div
            className="btn tooltip-right"
            style={{ fontSize: '20px' }}
            data-tooltip="Processing"
          ><i className="fa fa-spinner fa-spin"></i></div>
          : this.props.isSubscribed
          ? <div
            className="btn tooltip-right"
            onClick={this.unsubscribe}
            style={{ fontSize: '20px' }}
            data-tooltip="Unsubscribe"
          ><i className="fa fa-chain-broken"></i></div>
          : <div
            className="btn tooltip-right"
            onClick={this.subscribe}
            style={{ fontSize: '20px' }}
            data-tooltip="Subscribe"
          ><i className="fa fa-check-square-o"></i></div>}
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = _state => {
  const state = _state.vozLiving;
  const isThreadView = state.misc.currentView === 'thread';
  return {
    currentPost: state.currentPost,
    isThreadView,
    isSubscribed: isThreadView
      ? !_.isUndefined(state.followThreads[state.misc.threadId])
      : false,
    threadId: isThreadView
      ? state.misc.threadId
      : null,
  };
};

export default connect(mapStateToProps)(ReloadButton);
