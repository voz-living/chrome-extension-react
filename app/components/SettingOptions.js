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

  changeTextConfig(config, event) {
    this.props.dispatch(changeOption(config.key, event.target.value));
  }

  renderConfig(config) {
    const { settings } = this.props;
    let value = settings[config.key];
    if (_.isUndefined(value)) value = config.default || false;

    if (config.type === 'bool') {
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
    } else if (config.type === 'number') {
      return (
        <div className="control-wrapper" key={config.key}>
          <label>{config.name}
            <input
              className="control" type="number" value={value}
              onChange={(event) => this.changeTextConfig(config, event)}
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
          className={`btn tooltip-right ${this.state.showConfig ? 'active' : ''}`}
          onClick={() => this.setState({ showConfig: !this.state.showConfig })}
          data-tooltip="Settings"
        ><i className="fa fa-cogs"></i></div>
        {(() => {
          if (this.state.showConfig) {
            return [
              <div
                key="voz-mask-settings"
                className="voz-mask setting-mask"
                onClick={() => this.setState({ showConfig: !this.state.showConfig })}
              ></div>,
              <div className="btn-options" key="voz-settings">
                <h3>Settings</h3>
                <small>Note: You need refresh browser to apply settings</small>
                {configSideMenu.map(config => this.renderConfig(config))}
              </div>,
            ];
          }
          return null;
        })()}
      </div>
    );
  }
}

export default SettingOptions;
