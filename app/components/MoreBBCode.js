import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { insertTextIntoEditor } from '../../app/common/editor';

export default class MoreBBCode extends Component {
  static propTypes = {
    currentView: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.editor = null;
  }

  componentDidMount() {
    const { currentView } = this.props;
    if (currentView === 'thread'
      || currentView === 'new-reply'
      || currentView === 'edit-reply'
      || currentView === 'pm'
      || currentView === 'insert-pm'
      || currentView === 'new-thread') {
      let $control;
      if (currentView === 'thread' || currentView === 'pm') {
        $control = $('#vB_Editor_QR_controls');
        if ($control.length) {
          this.editor = $('#vB_Editor_QR_textarea');
          $control.css('display', 'inline-block');
          $control.after('<div id="vl_additional_cmd"></div><br/>');
        }
      } else {
        $control = $('#vB_Editor_001_controls');
        if ($control.length) {
          this.editor = $('#vB_Editor_001_textarea');
          this.editor.css('display', 'inline-block');
          $control.css('display', 'inline-block');
          $control.after('<div id="vl_additional_cmd"></div>');
        }
      }
      if (this.editor && this.editor.length && document.getElementById('vl_additional_cmd')) {
        render(
          <div>
            <a
              href="#"
              data-tooltip="Gạch chéo chữ"
              onClick={e => { e.preventDefault(); this.strikeText(); }}
            >
              <i className="fa fa-strikethrough" />
            </a>
            <a
              href="#"
              data-tooltip="Thêm tag spoiler (voz-living)"
              onClick={e => { e.preventDefault(); this.spoilerText(); }}
            >
              <i className="fa fa-eye-slash" />
            </a>
          </div>
          , document.getElementById('vl_additional_cmd'));
      }
    }
  }

  strikeText() {
    const text = window.getSelection().toString();
    const insert = `[STRIKE]${text}[/STRIKE]`;
    insertTextIntoEditor(insert, this.editor, {}, -insert.length + 8, -9);
  }

  spoilerText() {
    const text = window.getSelection().toString();
    const insert = `[COLOR="Spoiler"][COLOR="White"]${text}[/COLOR][/COLOR]`;
    insertTextIntoEditor(insert, this.editor, {}, -insert.length + 32, -16);
  }

  render() {
    return null;
  }
}
