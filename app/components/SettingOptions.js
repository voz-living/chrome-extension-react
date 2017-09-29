// import _ from 'lodash';
import React, { Component } from 'react';

class SettingOptions extends Component {
  openOptions() {
    chrome.runtime.sendMessage({ service: 'open-options' });
  }

  render() {
    return (
      <div className="btn-group">
        <div
          className={`btn tooltip-right`}
          onClick={this.openOptions}
          data-tooltip="Options"
        ><i className="fa fa-cogs"></i></div>
      </div>
    );
  }
}

export default SettingOptions;
