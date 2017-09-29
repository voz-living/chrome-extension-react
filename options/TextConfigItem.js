import React from 'react';
import { autobind } from 'core-decorators';
import ConfigItem from './ConfigItem';

@autobind
export default class TextConfigItem extends ConfigItem {

  changeHandler(e) {
    this.setValue(e.target.value);
  }

  renderConfig() {
    const { size = 30 } = this.props;
    return (
      <label className="text-item">
        {this.props.children}
        <input
          type="text"
          value={this.getValue()}
          onChange={this.changeHandler}
          size={size}
        />
      </label>
    );
  }
}
