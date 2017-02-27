import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import _ from 'lodash';


function getTime(timeStamp) {
  const date = new Date(timeStamp);
  const [h, m, d, mm] = [date.getHours(), date.getMinutes(), date.getDate(), date.getMonth() + 1]
    .map((x) => _.padStart(`${x}`, 2, '0'));
  /* eslint-disable max-len */
  return `${d}-${mm}-${date.getFullYear()} ${h}:${m}`;
  /* eslint-enable max-len */
}

@autobind
class PeerChatMessages extends Component {
  static propTypes = {
    messages: PropTypes.array,
  }

  static defaultProps = {
    messages: [],
  }

  constructor(props) {
    super(props);
    this.activeScrollTop = true;
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

  updateScrollToBottom() {
    if (this.activeScrollTop) {
      const element = ReactDOM.findDOMNode(this);

      if (element.scrollHeight > element.offsetHeight) {
        const diff = element.scrollHeight - element.offsetHeight;
        element.scrollTop = diff;
      }
    }
  }

  render() {
    const { messages } = this.props;

    return (
      <div className="voz-living-message-list">
        <ul>
          {messages.map(msg => (
            <li key={`${msg.name}-${msg.timeStamp}`}>
              <span className="voz-living-chat-time">{getTime(msg.timeStamp)}</span>
              <span className="voz-living-chat-name">{msg.name}: </span>
              <span className="voz-living-chat-message">{msg.message}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

module.exports = PeerChatMessages;
