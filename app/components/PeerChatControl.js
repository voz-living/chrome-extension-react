import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { autobind } from 'core-decorators';
import { getAuthenticationInformation, toClassName } from '../utils';

function getTime(timeStamp) {
  const date = new Date(timeStamp);
  /* eslint-disable max-len */
  return `${date.getHours()}:${date.getMinutes()} ${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  /* eslint-enable max-len */
}

@autobind
class PeerChat extends Component {
  constructor(props) {
    super(props);

    this.authInfo = getAuthenticationInformation();

    this.state = {
      messages: [],
      sendMessage: '',
      isConnect: false,
      isOpen: false,
    };

    chrome.runtime.onMessage.addListener((request) => {
      if (request.peerChatIncomeMessage) {
        this.setState({ messages: [
          ...this.state.messages, request.peerChatIncomeMessage,
        ] });
      }
    });
  }

  connect() {
    // connect socket establish room connection
    chrome.runtime.sendMessage({ peerChatConnect: true });
  }

  disconnect() {
    // disconnect all socket
    chrome.runtime.sendMessage({ peerChatDisconnect: true });
  }

  send() {
    const { sendMessage, messages } = this.state;

    if (sendMessage.trim() !== '') {
      const newMessage = {
        name: this.authInfo.username,
        timeStamp: new Date().getTime(),
        message: sendMessage,
      };

      // send message tab -> background -> send
      chrome.runtime.sendMessage({
        peerChatSendMessage: newMessage,
      }, this.setState({ sendMessage: '', messages: [...messages, newMessage] }));
    }
  }

  handleChange(event) {
    const message = event.target.value;
    this.setState({ sendMessage: message });
  }

  handleKeyUp(event) {
    if (event.keyCode === 13) this.send();
  }

  renderChatBody() {
    const { isConnect, sendMessage, messages } = this.state;

    if (isConnect) {
      return (
        <div className="voz-living-peer-chat-body">
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
          <input
            type="text" value={sendMessage}
            onChange={this.handleChange}
            onKeyUp={this.handleKeyUp}
          />
          <button onClick={this.send}>Send</button>
        </div>
      );
    }
    return (
      <div className="voz-living-peer-chat-body">
        <div
          className="voz-living-peer-chat-connect"
          onClick={() => {
            this.connect();
            this.setState({ isConnect: true });
          }}
        >
          VOZLiving <br />
          Peer Chat - Beta <br />
          <i className="fa fa-connectdevelop fa-3"></i> <br />
          <small>Click here to connect with other VOZers</small>
        </div>
      </div>
    );
  }

  render() {
    const { isOpen } = this.state;

    return (
      <div className={toClassName({ 'voz-living-peer-chat-wrapper': true, open: isOpen })}>
        <div className="voz-living-peer-chat">
          <div
            className="voz-living-peer-chat-header"
            onClick={() => this.setState({ isOpen: !isOpen })}
          >
            VOZLiving Peer Chat (Beta)
          </div>
          {this.renderChatBody()}
        </div>
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
      injector.id = 'voz-living-peer-chat-root';
      document.body.appendChild(injector);
      render(<PeerChat />, injector);
    }
  }

  render() { return null; }
}

export default PeerChatControl;
