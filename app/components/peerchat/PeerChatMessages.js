import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
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
  return `https://vozforums.com${out}`;
}

@autobind
class PeerChatMessages extends Component {
  static propTypes = {
    messages: PropTypes.array,
    color: PropTypes.array,
  }

  static defaultProps = {
    messages: [],
    color: [0, 0, 0],
  }

  constructor(props) {
    super(props);
    this.activeScrollTop = true;
    this.emoRegex = new RegExp(/:[a-zA-Z]*[\+)("\*-]?[0-9]?s?\)?\(?>?:?/, 'g');
  }

  componentDidMount() {
    const element = ReactDOM.findDOMNode(this);
    element.addEventListener('scroll', this.onScroll);
  }

  componentDidUpdate() {
    this.updateScrollToBottom();
  }

  componentWillUnmount() {
    const element = ReactDOM.findDOMNode(this);
    element.removeEventListener('scroll', this.onScroll);
  }

  onScroll() {
    const element = ReactDOM.findDOMNode(this);
    const diff = element.scrollHeight - element.offsetHeight;

    if (element.scrollTop >= diff) {
      this.activeScrollTop = true;
    } else {
      this.activeScrollTop = false;
    }
  }

  getColor(name) {
    if (name) {
      const lname = name.toLowerCase();
      const rbg = lname.split('').map(c => (c.charCodeAt(0) * 10) % 255).slice(0, 3);
      return `rgb(${rbg[0]}, ${rbg[1]}, ${rbg[2]})`;
    }
    return 'rgb(0, 0, 0)';
  }

  updateScrollToBottom() {
    if (this.activeScrollTop) {
      const element = ReactDOM.findDOMNode(this);

      if (element.scrollHeight > element.offsetHeight) {
        const diff = element.scrollHeight - element.offsetHeight;
        element.scrollTop = diff;
      }
    }
  }

  prepareMessage(msg) {
    let out = msg.message;
    const id = `${msg.name}-${msg.timeStamp}`;

    if (out && out.length > 0) {
      const splits = out.split(this.emoRegex);
      const emotis = out.match(this.emoRegex);
      if (splits && splits.length > 0) {
        out = (
          <div>{splits.map((txt, idx) => {
            if (!emotis || !emotis[idx]) return <span key={`message-${idx}-${id}`}>{txt}</span>;
            const found = emotions.find(f => f.text === emotis[idx]);
            if (found) {
              return (
                <span
                  key={`message-${idx}-${id}`}
                >{txt} <img src={prepareEmotionUrl(found.src)} alt={found.text} /></span>
              );
            }
            return <span key={`message-${idx}-${id}`}>{txt}</span>;
          })}</div>
        );
      }
    }
    return out;
  }

  render() {
    const { messages } = this.props;

    return (
      <div className="voz-living-message-list">
        <ul>
          {messages.map(msg => (
            <li
              key={`${msg.name}-${msg.timeStamp}`}
              style={{ borderColor: this.getColor(msg.name) }}
            >
              <span className="voz-living-chat-time">{getTime(msg.timeStamp)}</span>
              <span className="voz-living-chat-name">{msg.name}: </span>
              <div className="voz-living-chat-message">{this.prepareMessage(msg)}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

module.exports = PeerChatMessages;
