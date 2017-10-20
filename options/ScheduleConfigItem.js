import React from 'react';
import { autobind } from 'core-decorators';
import ConfigItem from './ConfigItem';

@autobind
export default class ScheduleConfigItem extends ConfigItem {

  changeHandler(e) {
    this.setValue(e.target.value);
  }

  renderConfig() {
    return (
      <span className="schedule-config-item">
         {this.props.children}
        <input
          type="time"
          value={this.getValue()}
          onChange={this.changeHandler}
        />
      </span>
        );
  }
}
