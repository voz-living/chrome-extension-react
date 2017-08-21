import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import { autobind } from 'core-decorators';
import { render } from 'react-dom';
import { insertTextIntoEditor } from '../common/editor';
import EmotionPicker from './EmotionPicker';
import StickerPicker from './StickerPicker';
import { getChromeLocalStore, setChromeLocalStore } from '../utils/settings';

@autobind
class EmotionControl extends Component {
  static propTypes = {
    emotionHelper: PropTypes.bool,
    currentView: PropTypes.string,
  }

  constructor(comProps) {
    super(comProps);
    this.editor = null;
  }

  componentWillReceiveProps(nextProps) {
    this.updateEmotionHelper(nextProps);
  }

  onIconClick(emotion) {
    if (this.editor) {
      insertTextIntoEditor(emotion.text, this.editor);
    }
  }

  onStickerClick(sticker) {
    if (this.editor && sticker.url) {
      const bbcode = `[IMG]${sticker.url}[/IMG]`;
      insertTextIntoEditor(bbcode, this.editor);
    }
  }

  updateEmotionHelper(nextProps = this.props) {
    const { emotionHelper, currentView } = nextProps;
    const hasSmileBox = $('.smilebox').length !== 0;

    if (emotionHelper && !hasSmileBox) {
      if (currentView === 'thread' || currentView === 'new-reply' || currentView === 'edit-reply') {
        let smileCont = null;
        const stickerBox = document.createElement('div');
        let classView = '';

        if (currentView === 'thread') {
          this.editor = $('#vB_Editor_QR_textarea');
          smileCont = this.editor.parents('#vB_Editor_QR').eq(0);
          if (smileCont.length === 0) return;
          const emoExpand = getChromeLocalStore(['emoExpand']); // khong get duoc gia tri?
          if (emoExpand !== null && emoExpand.length > 0) {
            classView = emoExpand;
          } else {
            classView = 'compact';
          }
          smileCont.append(stickerBox);
        } else if (currentView === 'new-reply' || currentView === 'edit-reply') {
          this.editor = $('#vB_Editor_001_textarea');
          smileCont = $('#vB_Editor_001_smiliebox');
          smileCont.find('table').remove();
          classView = 'full';
          this.editor.parent().append(stickerBox);
        }

        const smileBox = document.createElement('div');
        smileBox.className = `smilebox ${classView}`;
        stickerBox.className = classView;
        smileCont.append(smileBox);

        render(<EmotionPicker onIconClick={this.onIconClick} />, smileBox);
        render(<StickerPicker onStickerClick={this.onStickerClick} />, stickerBox);
      }
    }
  }

  render() { return null; }
}

export default EmotionControl;
