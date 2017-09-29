import React from 'react';
import { autobind } from 'core-decorators';
import ConfigItem from './ConfigItem';

@autobind
export default class OnOffConfigItem extends ConfigItem {

  toggleCheckBoxHandler() {
    this.setValue(!this.getValue());
  }

  renderConfig() {
    return (
      <label className="on-off-item">
        <input type="checkbox" checked={this.getValue()} onChange={this.toggleCheckBoxHandler} />
        {this.props.children}
      </label>
    );
  }
}
