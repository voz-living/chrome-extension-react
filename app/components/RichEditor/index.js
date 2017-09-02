import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import { autobind } from 'core-decorators';
import { render } from 'react-dom';
// import { insertTextIntoEditor } from '../common/editor';
import Editor from './Editor';
import Recommendation from './Recommendation';

@autobind
class RichEditor extends Component {
  static propTypes = {
    stickerPanelExpand: PropTypes.bool.isRequired,
  }

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
    render(<Editor target="vB_Editor_QR_textarea" stickerPanelExpand={this.props.stickerPanelExpand} />, $editor[0]);
  }

  render() { 
    console.log('RichEditor');
    return null;
  }
}

RichEditor.Recommendation = Recommendation;
export default RichEditor;
