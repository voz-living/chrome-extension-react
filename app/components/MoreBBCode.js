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
      if (currentView === 'thread' || currentView === 'pm') {
        this.editor = $('#vB_Editor_QR_textarea');
        $('#vB_Editor_QR_controls').after('<div id="vl_additional_cmd"></div>');
      } else {
        this.editor = $('#vB_Editor_001_textarea');
        $('#vB_Editor_001_controls').after('<div id="vl_additional_cmd"></div>');
      }
      render(
        <div>
          <a
            href="#"
            title="Gạch chéo chữ"
            onClick={e => { e.preventDefault(); this.strikeText(); }}
          >
            <i className="fa fa-strikethrough fa-lg" />
          </a>
          <a
            href="#"
            title="Thêm tag spoiler (voz-living)"
            onClick={e => { e.preventDefault(); this.spoilerText(); }}
          >
            <i className="fa fa-eye-slash fa-lg" />
          </a>
        </div>
      , document.getElementById('vl_additional_cmd'));
    }
  }

  strikeText() {
    const text = `[STRIKE]${window.getSelection().toString()}[/STRIKE]`;
    insertTextIntoEditor(text, this.editor);
  }

  spoilerText() {
    const text = `[COLOR="Spoiler"][COLOR="White"]${window.getSelection().toString()}[/COLOR][/COLOR]`;
    insertTextIntoEditor(text, this.editor);
  }

  render() {
    return null;
  }
}
