import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import configSideMenu from '../constants/configSideMenu';

class SideMenu extends Component {
  static propTypes = {
    setting: PropTypes.object,
  }

  static defaultProps = {
    setting: {},
  }

  constructor(comProps) {
    super(comProps);
  }

  changeConfig(config, newValue) {
    console.log(config, newValue);
  }

  renderConfig(config) {
    const { setting } = this.props;
    const value = setting[config.key];

    if (value && config.type === 'bool') {
      return (
        <div className="control-wrapper">
          <label>{config.name}
            <input
              className="control"
              type="checkbox" checked={value}
              onClick={() => this.changeConfig(config, !value)}
            />
          </label>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="voz-living-side-menu">
        <div className="btn">
          Config
        </div>
        <div className="side-setting">
          {configSideMenu.map(config => this.renderConfig(config))}
        </div>
      </div>
    );
  }
}

export default SideMenu;
