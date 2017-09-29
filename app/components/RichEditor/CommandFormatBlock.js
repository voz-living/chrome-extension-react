import React, { PropTypes } from 'react';
import { autobind } from 'core-decorators';
import Command from './Command';

@autobind
class CommandFormatBlock extends Command {
  static propTypes = {
    block: PropTypes.string.isRequired,
  }

  static defaultProps = {
    block: 'p',
  }

  onClick(e) {
    const { block, showDefaultUI } = this.props;
    document.execCommand('formatBlock', showDefaultUI, block);
    e.preventDefault();
    return false;
  }

  render() {
    const { tt, block } = this.props;
    return (
      <a href="#" data-command="#" data-tooltip={tt} style={{ position: 'relative' }} onClick={this.onClick}>{block.toUpperCase()}</a>
    );
  }
}

export default CommandFormatBlock;
