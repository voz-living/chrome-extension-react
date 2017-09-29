import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import { autobind } from 'core-decorators';
import { updateConfig } from '../../../options/OptionPage';
@autobind
class Recommendation extends Component {
  static propTypes = {}

  shouldComponentUpdate(nextProps) {
    return false;
  }

  componentDidMount() {
    const rec = document.createElement('a');
    const text = document.createTextNode('Thử nghiệm WYSIWYG Editor ?');
    rec.appendChild(text);
    rec.href = '#';
    rec.style.textAlign = 'center';
    rec.addEventListener('click', (e) => {
      e.preventDefault();
      updateConfig('enableRichEditor', true)
        .then(() => { location.reload(); });
      return false;
    });
    $('.panelsurround .panel').prepend(rec);
  }

  render() {
    return null;
  }
}

export default Recommendation;
