import React from 'react';
import { autobind } from 'core-decorators';
import ConfigItem from './ConfigItem';

@autobind
export default class SelectConfigItem extends ConfigItem {
  selectHandler(e) {
    this.setValue(e.target.value);
  }

  renderConfig() {
    return (
      <span className="select-config-item">
        {this.props.children}
        <select onChange={this.selectHandler}>
          {this.props.selections.map(attr =>
            <option value={attr[0]} selected={attr[0] === this.getValue()}>{attr[1]}</option>
          )}
        </select>
      </span>
    );
  }
}
