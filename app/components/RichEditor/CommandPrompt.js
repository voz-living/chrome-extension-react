import React, { PropTypes } from 'react';
import { autobind } from 'core-decorators';
import Command from './Command';

@autobind
class CommandFormatBlock extends Command {
  static propTypes = {
    command: PropTypes.string.isRequired,
    ask: PropTypes.string.isRequired,
    def: PropTypes.string.isRequired,
  }

  onClick(e) {
    const { command, showDefaultUI, ask, def } = this.props;
    const value = window.prompt(ask, def);
    if (value !== null) {
      document.execCommand(command, showDefaultUI, value);
    }
    e.preventDefault();
    return false;
  }
}

export default CommandFormatBlock;
