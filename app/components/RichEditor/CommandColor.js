import React, { PropTypes } from 'react';
import { autobind } from 'core-decorators';
import Command from './Command';

@autobind
class CommandFormatBlock extends Command {
  static propTypes = {
    command: PropTypes.string.isRequired,
    palette: PropTypes.arrayOf(PropTypes.sring),
  }

  constructor(props) {
    const superProps = {
      command: 'formatBlock',
      value: props.block,
    };
    super(superProps);
  }
  onClick(e) {
    e.preventDefault();
    return false;
  }

  render() {
    return (
      <div className="fore-wrapper"><i className="fa fa-font" style={{ color: '#C96' }}></i>
        <div className="fore-palette">
          {this.props.palette.map(color =>
            <Command
              command={this.props.command}
              value={color}
              extraProps={{
                className: 'palette-item',
                style: { backgroundColor: color },
              }}
              tt={this.props.tt}
            />
          )}
        </div>
      </div>
    );
  }
}

export default CommandFormatBlock;
