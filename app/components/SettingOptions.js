import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import configSideMenu from '../constants/configSideMenu';
import {
  changeOption,
} from '../actions/voz';

class SettingOptions extends Component {
  static propTypes = {
    settings: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor(comProps) {
    super(comProps);

    this.state = {
      showConfig: false,
    };
  }

  changeConfig(config) {
    this.props.dispatch(changeOption(config.key));
  }

  renderConfig(config) {
    const { settings } = this.props;
    const value = settings[config.key];

    if (!_.isUndefined(value) && config.type === 'bool') {
      return (
        <div className="control-wrapper" key={config.key}>
          <label>{config.name}
            <input
              className="control"
              type="checkbox" checked={value}
              onChange={() => this.changeConfig(config)}
            />
          </label>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="btn-group">
        <div
          className="btn"
          onClick={() => this.setState({ showConfig: !this.state.showConfig })}
        ><i className="fa fa-cogs"></i></div>
        {(() => {
          if (this.state.showConfig) {
            return (
              <div className="btn-options">
                <h3>Settings</h3>
                <small>Note: You need to refresh browser to apply settings</small>
                {configSideMenu.map(config => this.renderConfig(config))}
              </div>
            );
          }
          return null;
        })()}
      </div>
    );
  }
}

export default SettingOptions;
