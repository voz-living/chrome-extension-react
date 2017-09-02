import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
// import { insertTextIntoEditor } from '../common/editor';

@autobind
class Command extends Component {
  static propTypes = {
    command: PropTypes.string.isRequired,
    value: PropTypes.any,
    showDefaultUI: PropTypes.bool,
    faClass: PropTypes.string,
    extraProps: PropTypes.object,
  }

  static defaultProps = {
    showDefaultUI: false,
    value: null,
    extraProps: {},
  }

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return false;
  }

  onClick(e) {
    const { command, value, showDefaultUI } = this.props;
    document.execCommand(command, showDefaultUI, value);
    e.preventDefault();
    return false;
  }

  render() {
    const { faClass, extraProps } = this.props;
    return (
      <a href="#" data-command="bold" onClick={this.onClick} { ...extraProps }><i className={'fa fa-' + faClass}></i></a>
    );
  }
}

export const Separator = () => <span className="command-separator"></span>;

export default Command;
