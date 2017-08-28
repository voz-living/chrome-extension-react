import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import { autobind } from 'core-decorators';
import { render } from 'react-dom';
// import { insertTextIntoEditor } from '../common/editor';
import Editor from './Editor';

@autobind
class RichEditor extends Component {
  static propTypes = {}

  constructor(comProps) {
    super(comProps);
    
  }

  componentWillReceiveProps(nextProps) {
    
  }

  shouldComponentUpdate(nextProps) {
    return false;
  }

  componentDidMount() {
    const target = $('form#qrform');
    const $editor = $('<div class="vozliving-editor"></div>');
    $editor.insertBefore(target);
    render(<Editor target="vB_Editor_QR_textarea" />, $editor[0]);
  }

  render() { 
    console.log('RichEditor');
    return null;
  }
}

export default RichEditor;
