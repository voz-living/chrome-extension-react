import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import emotions from '../../constants/emotions';

function getTime(timeStamp) {
  const date = new Date(timeStamp);
  const [h, m, d, mm] = [date.getHours(), date.getMinutes(), date.getDate(), date.getMonth() + 1]
    .map((x) => _.padStart(`${x}`, 2, '0'));
  /* eslint-disable max-len */
  return `${d}-${mm}-${date.getFullYear()} ${h}:${m}`;
  /* eslint-enable max-len */
}

function prepareEmotionUrl(url) {
  let out = url;
  if (out.indexOf('http') > -1) return '';
  if (out.charAt(0) !== '/') out = `/${out}`;
  return `https://forums.voz.vn${out}`;
}

function splitArray(str, arr) {
  let result = str;
  if (arr && arr.length > 0) {
    arr.forEach(s => {
      result = result.replace(s, '_vozVOZLivingvoz_');
    });
    result = result.split('_vozVOZLivingvoz_');
    return result;
  }
  return [str];
}

@autobind
class PeerChatMessage extends Component {
  static propTypes = {
    text: PropTypes.string,
    timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    username: PropTypes.string,
  }

  static defaultProps = {
    text: '',
    username: '',
    timestamp: '',
  }

  constructor(props) {
    super(props);
    this.emoRegex = new RegExp(/[^\w]\^?[:;-][a-zA-Z_]*[\+)("\*-]?[0-9]?s?\)?\(?>?:?\^?/, 'g');
    this.linkRegex = new RegExp(/(http[s]?:\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?/, 'gi');
  }

  getColor(name) {
    if (name) {
      const lname = name.toLowerCase().replace(/\W+/g, '');
      const rbg = lname.split('').map(c => Math.abs(~~((c.charCodeAt(0) - 48) * 3))).slice(0, 3);
      return `rgb(${rbg[0]}, ${rbg[1]}, ${rbg[2]})`;
    }
    return 'rgb(0, 0, 0)';
  }

  prepareTextLink(text) {
    if (typeof(text) === 'string') {
      const links = text.match(this.linkRegex);
      const splits = splitArray(text, links);
      if (splits && splits.length > 0 && links && links.length > 0) {
        return (
          <div>{splits.map((txt, idx) => {
            if (links[idx]) {
              return (
                <span key={`link-${txt}-${idx}`}>{txt}
                  <a href={links[idx]} target="_blank">{links[idx]}</a>
                </span>
              );
            }
            return <span key={`link-${txt}-${idx}`}>{txt}</span>;
          })}</div>
        );
      }
    }
    return text;
  }

  prepareMessage(text, username, timestamp) {
    let out = text;
    const id = `${username}-${timestamp}`;

    if (out && out.length > 0) {
      const splits = out.split(this.emoRegex);
      const emotis = out.match(this.emoRegex);
      if (splits && splits.length > 0) {
        out = (
          <div>{splits.map((txt, idx) => {
            if (!emotis || !emotis[idx]) {
              return <span key={`message-${idx}-${id}`}>{this.prepareTextLink(txt)}</span>;
            }
            const found = emotions.find(f => f.text === emotis[idx].trim());
            if (found) {
              return (
                <span
                  key={`message-${idx}-${id}`}
                >{this.prepareTextLink(txt)} <img
                  src={prepareEmotionUrl(found.src)} alt={found.text}
                />
                </span>
              );
            }
            return (
              <span key={`message-${idx}-${id}`}>
                {this.prepareTextLink(txt) || ''}{emotis[idx] || ''}
              </span>
            );
          })}</div>
        );
      }
    }
    return out;
  }

  render() {
    const { text, timestamp, username } = this.props;
    const message = this.prepareMessage(text);

    return (
      <div
        key={`${username}-${timestamp}`}
        style={{ borderColor: this.getColor(username) }}
      >
        <span className="voz-living-chat-time">{getTime(timestamp)}</span>
        <span className="voz-living-chat-name">{username}: </span>
        <div className="voz-living-chat-message">{message}</div>
      </div>
    );
  }
}

module.exports = PeerChatMessage;
