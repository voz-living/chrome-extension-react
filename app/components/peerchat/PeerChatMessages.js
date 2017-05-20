import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import PeerChatMessage from './PeerChatMessage';

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

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps.messages, this.props.messages);
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
              <PeerChatMessage text={msg.message} timestamp={msg.timeStamp} username={msg.name} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

module.exports = PeerChatMessages;
