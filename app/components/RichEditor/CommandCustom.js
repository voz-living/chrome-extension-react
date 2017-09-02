import React, { PropTypes } from 'react';
import { autobind } from 'core-decorators';
import Command from './Command';

@autobind
class CommandCustom extends Command {
  static propTypes = {
    html: PropTypes.string.isRequired,
    label: PropTypes.node,
  }

  onClick(e) {
    const { html, showDefaultUI } = this.props;
    const sel = document.getSelection();
    let selection = '';
    if (sel.rangeCount) {
      const container = document.createElement('div');
      for (let i = 0, len = sel.rangeCount; i < len; ++i) {
        container.appendChild(sel.getRangeAt(i).cloneContents());
      }
      selection = container.innerHTML;
    }
    const finalHtml = html.replace(/__SELECTION__/g, selection);
    document.execCommand('insertHTML', showDefaultUI, finalHtml);
    e.preventDefault();
    return false;
  }

  render() {
    return (
      <a href="#" data-command="#" onClick={this.onClick}>{this.props.label}</a>
    );
  }
}

export default CommandCustom;
