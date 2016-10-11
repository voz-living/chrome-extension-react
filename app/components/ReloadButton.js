import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import $ from 'jquery';
import Mousetrap from 'mousetrap';
import { GET } from '../utils/http';
import { getCurrentView } from '../utils';
import {
  getThreadList,
} from '../actions/voz';

class ReloadButton extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  constructor(comProps) {
    super(comProps);
    this.view = getCurrentView();
  }

  componentDidMount() {
    if (this.view === 'thread-list') {
      Mousetrap.bind('command+r', event => {
        event.preventDefault();
        this.reloadPage();
      });
    }
  }

  @autobind
  reloadPage() {
    const { dispatch } = this.props;

    GET(location.href).then(response => { // eslint-disable-line
      const responseThreadList = $('#threadslist', response);
      const currentThreadList = $('#threadslist');
      currentThreadList.replaceWith(responseThreadList);

      dispatch(getThreadList());
    });
  }

  render() {
    if (this.view === 'thread-list') {
      return (
        <div className="btn-group">
          <div
            className="btn"
            onClick={this.reloadPage}
            style={{ fontSize: '20px' }}
          ><i className="fa fa-refresh"></i></div>
        </div>
      );
    }
    return null;
  }
}

export default ReloadButton;
