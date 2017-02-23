import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import $ from 'jquery';
import Mousetrap from 'mousetrap';
import { GET } from '../utils/http';
import { getCurrentView } from '../utils';
import {
  getThreadList,
} from '../actions/voz';

@autobind
class ReloadButton extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    isReloadButton: PropTypes.bool,
  }

  componentDidMount() {
    this.bindReloadButton();
  }

  componentWillReceiveProps(nextProps) {
    this.bindReloadButton(nextProps);
  }

  componentWillUnmount() {
    Mousetrap.unbind(['command+r', 'ctrl+r']);
  }

  bindReloadButton(nextProps = this.props) {
    const view = getCurrentView();

    if (view === 'thread-list' && nextProps.isReloadButton) {
      Mousetrap.bind(['command+r', 'ctrl+r'], event => {
        event.preventDefault();
        this.reloadPage();
      });
    } else {
      Mousetrap.unbind(['command+r', 'ctrl+r']);
    }
  }

  reloadPage() {
    const { dispatch } = this.props;

    window.vozLivingLoader.start();

    GET(location.href).then(response => { // eslint-disable-line
      const responseThreadList = $('#threadslist', response);
      const currentThreadList = $('#threadslist');
      currentThreadList.replaceWith(responseThreadList);

      dispatch(getThreadList());

      window.vozLivingLoader.stop();
    });
  }

  render() {
    const { isReloadButton } = this.props;
    const view = getCurrentView();

    if (view === 'thread-list' && isReloadButton) {
      return (
        <div className="btn-group">
          <div
            className="btn tooltip-right"
            onClick={this.reloadPage}
            style={{ fontSize: '20px' }}
            data-tooltip="Fast Refresh"
          ><i className="fa fa-refresh"></i></div>
        </div>
      );
    }
    return null;
  }
}

export default ReloadButton;
