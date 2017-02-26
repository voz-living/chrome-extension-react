import React from 'react';
import { autobind } from 'core-decorators';
import ConfigItem from './ConfigItem';

@autobind
export default class NumberConfigItem extends ConfigItem {

  changeHandler(e) {
    this.setValue(e.target.value);
  }

  renderConfig() {
    const { min = 0, step = 1, max = 1000 } = this.props;
    return (
      <label className="on-off-item">
        {this.props.children}
        <input
          type="number"
          value={this.getValue()}
          onChange={this.changeHandler}
          min={min}
          max={max}
          step={step}
        />
      </label>
    );
  }
}