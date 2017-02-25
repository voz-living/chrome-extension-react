import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';


function getTime(timeStamp) {
  const date = new Date(timeStamp);
  /* eslint-disable max-len */
  return `${date.getHours()}:${date.getMinutes()} ${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;
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
              <span className="voz-living-chat-name">{msg.name}: </span>
              <span className="voz-living-chat-time">{getTime(msg.timeStamp)}</span>
              <div className="voz-living-chat-message">{msg.message}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

module.exports = PeerChatMessages;
