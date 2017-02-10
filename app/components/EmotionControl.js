import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import emotions from '../constants/emotions';
import { autobind } from 'core-decorators';
import { render } from 'react-dom';

@autobind
class EmotionPicker extends Component {
  static propTypes = {
    onIconClick: PropTypes.func,
  }

  prepareEmotionUrl(url) {
    let out = url;
    if (out.indexOf('http') > -1) return '';
    if (out.charAt(0) !== '/') out = `/${out}`;
    return `https://vozforums.com${out}`;
  }

  choseEmotion(emotion) {
    this.props.onIconClick(emotion);
  }

  render() {
    return (
      <div className="emotion-box">
        {emotions.map(emotion => (
          <div className="emo" key={emotion.text}>
            <img
              alt={emotion.text}
              src={this.prepareEmotionUrl(emotion.src)}
              onClick={() => this.choseEmotion(emotion)}
            />
          </div>
        ))}
      </div>
    );
  }
}

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
      const value = this.editor.val();
      const selStart = this.editor.prop('selectionStart');
      const selEnd = this.editor.prop('selectionEnd');
      const textBefore = value.substring(0, selStart);
      const textAfter = value.substring(selEnd, value.length);

      this.editor.val(textBefore + emotion.text + textAfter);
      this.editor[0].setSelectionRange(
        selStart + emotion.text.length, selStart + emotion.text.length);
      this.editor.focus();
    }
  }

  updateEmotionHelper(nextProps = this.props) {
    const { emotionHelper, currentView } = nextProps;
    const hasSmileBox = $('.smilebox').length !== 0;

    if (emotionHelper && !hasSmileBox) {
      if (currentView === 'thread' || currentView === 'new-reply') {
        let smileCont = null;

        if (currentView === 'thread') {
          this.editor = $('#vB_Editor_QR_textarea');
          smileCont = this.editor.parents('#vB_Editor_QR').eq(0);
          if (smileCont.length === 0) return;
        } else if (currentView === 'new-reply') {
          this.editor = $('#vB_Editor_001_textarea');
          smileCont = $('#vB_Editor_001_smiliebox');
          smileCont.find('table').remove();
        }
        const smileBox = document.createElement('div');
        smileBox.className = 'smilebox';
        smileCont.append(smileBox);

        render(<EmotionPicker onIconClick={this.onIconClick} />, smileBox);
      }
    }
  }

  render() { return null; }
}

export default EmotionControl;
