import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { autobind } from 'core-decorators';

@autobind
class PeerChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      sendMessage: '',
    };

    /* eslint-disable no-undef */
    chrome.runtime.onMessage.addListener((request) => {
      if (request.peerChatIncomeMessage) {
        this.setState({ messages: [
          ...this.state.messages, request.peerChatIncomeMessage,
        ] });
      }
    });
    /* eslint-enable no-undef */
  }

  send() {
    const { sendMessage, messages } = this.state;
    const newMessage = {
      name: 'son',
      timeStamp: new Date().getTime(),
      message: sendMessage,
    };

    /* eslint-disable no-undef */
    chrome.runtime.sendMessage({
      peerChatSendMessage: newMessage,
    }, this.setState({ sendMessage: '', messages: [...messages, newMessage] }));
    /* eslint-enable no-undef */
  }

  handleChange(event) {
    const message = event.target.value;
    this.setState({ sendMessage: message });
  }

  render() {
    const { messages, sendMessage } = this.state;

    return (
      <div className="voz-living-peer-chat-wrapper">
        <div className="voz-living-message-list">
          <ul>
            {messages.map(msg => (
              <li key={msg.timeStamp}>{msg.name}: {msg.message || ''}</li>
            ))}
          </ul>
        </div>
        <input type="text" value={sendMessage} onChange={this.handleChange} />
        <button onClick={this.send}>Send</button>
      </div>
    );
  }
}

class PeerChatControl extends Component {
  static propTypes = {
    isPeerChat: PropTypes.bool,
  }

  static defaultProps = {
    isPeerChat: true,
  }

  componentDidMount() {
    this.addPeerChat(this.props);
  }

  addPeerChat(nextProps = this.props) {
    const { isPeerChat } = nextProps;

    if (isPeerChat) {
      const injector = document.createElement('div');
      injector.id = 'voz-living-peer-chat';
      document.body.appendChild(injector);
      render(<PeerChat />, injector);
    }
  }

  render() { return null; }
}

export default PeerChatControl;
