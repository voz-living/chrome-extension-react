import React, { Component, PropTypes } from 'react';
import emotions from '../constants/emotions';
import { autobind } from 'core-decorators';
import { setChromeSyncStore, getChromeSyncStore, getChromeLocalStore, setChromeLocalStore } from '../utils/settings';
import $ from 'jquery';

@autobind
export default class EmotionPicker extends Component {
  static propTypes = {
    onIconClick: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.usageData = {};
  }

  componentDidMount() {
    require('../styles/emotion-box.less');
    setTimeout(() => {
      getChromeSyncStore(['stickerUsageData']).then(store => {
        if (typeof store.stickerUsageData !== 'undefined') this.usageData = store.stickerUsageData;
      });
    }, 500);
    getChromeLocalStore(['emoticonPanelExpand'])
      .then(({ emoticonPanelExpand = 'compact' }) => {
        $(this.$this).closest('.smilebox').addClass(emoticonPanelExpand);
        if (emoticonPanelExpand === 'full') {
          $('.emo-header i').removeClass('fa-expand').addClass('fa-minus');
        }
      });
  }

  prepareEmotionUrl(url) {
    let out = url;
    if (out.indexOf('http') > -1) return '';
    if (out.charAt(0) !== '/') out = `/${out}`;
    return `https://forums.voz.vn${out}`;
  }

  choseEmotion(emotion) {
    this.props.onIconClick(emotion);
  }

  expandEmo() {
    const $parent = $(this.$this).closest('.smilebox');
    const emoHeader = $parent.find('.emo-header i');
    emoHeader.toggleClass('fa-expand fa-minus');
    if (emoHeader.hasClass('fa-expand')) {
      $parent.addClass('compact').removeClass('full');
      setChromeLocalStore({ emoticonPanelExpand: 'compact' });
    } else if (emoHeader.hasClass('fa-minus')) {
      $parent.addClass('full').removeClass('compact');
      setChromeLocalStore({ emoticonPanelExpand: 'full' });
    }
  }
  render() {
    return (<div ref={r => this.$this = r} >
      {$('#vB_Editor_QR_textarea').length > 0 &&
        <div className="emo-header">Smilies
          <div className="emo-expand">
            <i
              className="fa fa-expand fa-lg" aria-hidden
              onClick={() => this.expandEmo()}
            />
          </div>
        </div>
      }
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
      </div></div>
    );
  }
}
