import React, { Component, PropTypes } from 'react';
import emotions from '../constants/emotions';
import { autobind } from 'core-decorators';

@autobind
export default class EmotionPicker extends Component {
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
