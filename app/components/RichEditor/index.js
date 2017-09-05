import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import { autobind } from 'core-decorators';
import { render } from 'react-dom';
// import { insertTextIntoEditor } from '../common/editor';
import Editor from './Editor';
import Recommendation from './Recommendation';

function createToggleForEditor($table) {
  const TG_CLASS = 'hide_adv_editor';
  const $toggle = $('<a href="#"><img src="https://vozforums.com/images/buttons/collapse_tcat.gif"> Đóng/mở Khung soạn thảo gốc</a>');
  $toggle.on('click', (e) => {
    e.preventDefault();
    $table.toggleClass(TG_CLASS);
    return false;
  });
  $table.addClass(TG_CLASS);
  $table.before($toggle);
}

@autobind
class RichEditor extends Component {
  static propTypes = {
    stickerPanelExpand: PropTypes.bool.isRequired,
    currentView: PropTypes.string,
  }

  constructor(comProps) {
    super(comProps);
  }

  componentDidMount() {
    const advEditor = document.querySelector('#vB_Editor_001_textarea');
    const qckEditor = document.querySelector('#vB_Editor_QR_textarea');
    let renderTarget;
    let editorTargetId;
    if (advEditor !== null) {
      const target = $('#vB_Editor_001').closest('table');
      const $editor = $('<div class="vozliving-editor"></div>');
      $editor.insertBefore(target);
      renderTarget = $editor[0];
      editorTargetId = 'vB_Editor_001_textarea';
      createToggleForEditor(target);
    } else if (qckEditor !== null) {
      let target = $('form#qrform');
      if (target.length === 0) {
        target = $('form#message_form');
        if (target.length > 0) {
          createToggleForEditor(target);
        }
      }
      const $editor = $('<div class="vozliving-editor"></div>');
      $editor.insertBefore(target);
      renderTarget = $editor[0];
      editorTargetId = 'vB_Editor_QR_textarea';
    }

    render(<Editor target={editorTargetId} stickerPanelExpand={this.props.stickerPanelExpand} currentView={this.props.currentView} />, renderTarget);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() { 
    console.log('RichEditor');
    return null;
  }
}

RichEditor.Recommendation = Recommendation;
export default RichEditor;
