import React, { Component, PropTypes } from 'react';
import {
  setChromeLocalStore,
} from '../app/utils/settings';
import { autobind } from 'core-decorators';

export function setConfig(name, value, settings) {
  return setChromeLocalStore({ settings: {
    ...settings,
    [name]: value,
  } });
}

@autobind
export default class ConfigItem extends Component {
  static propTypes = {
    configKey: PropTypes.string,
    parent: PropTypes.object,
    helpText: PropTypes.string,
    helpUrl: PropTypes.string,
  }

  getValue() {
    return this.props.parent.settings[this.props.configKey];
  }

  setValue(val) {
    setConfig(this.props.configKey, val, this.props.parent.settings);
    this.props.parent.updateConfig();
  }

  renderConfig() {
    return null;
  }

  render() {
    return (
      <div className="item-wrapper">
        {this.renderConfig()}
      </div>
    );
  }
}
