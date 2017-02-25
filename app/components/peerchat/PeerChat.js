import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { getAuthenticationInformation, toClassName } from '../../utils';
import PeerChatMessages from './PeerChatMessages';

@autobind
class PeerChat extends Component {
  constructor(props) {
    super(props);

    this.authInfo = getAuthenticationInformation();
    this.maxMessageNumber = 100;

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
    this.setState({ isConnect: true });
    chrome.runtime.sendMessage({ peerChatConnect: true });
  }

  disconnect() {
    // disconnect all socket
    this.setState({ isConnect: false, messages: [], sendMessage: '' });
    chrome.runtime.sendMessage({ peerChatDisconnect: true });
  }

  send() {
    const { sendMessage, messages } = this.state;
    const cleanMessage = sendMessage.trim();

    if (cleanMessage.length > 250) {
      window.alert('Tin nhắn của bạn không được dài quá 250 ký tự.');
      return;
    }

    if (cleanMessage !== '') {
      const newMessage = {
        name: this.authInfo.username,
        timeStamp: new Date().getTime(),
        message: sendMessage,
      };

      let newMessages = messages;

      if (messages.length >= this.maxMessageNumber - 1) {
        newMessages = newMessages.reverse().slice(0, this.maxMessageNumber).reverse();
      }

      // send message tab -> background -> send
      chrome.runtime.sendMessage({
        peerChatSendMessage: newMessage,
      }, this.setState({ sendMessage: '', messages: [...newMessages, newMessage] }));
    }
  }

  handleChange(event) {
    const message = event.target.value;
    this.setState({ sendMessage: message });
  }

  handleKeyUp(event) {
    if (event.keyCode === 13) this.send();
  }

  toggleOpen() {
    const { isOpen } = this.state;
    if (isOpen) this.disconnect();
    this.setState({ isOpen: !isOpen });
  }

  renderChatBody() {
    const { isConnect, sendMessage, messages } = this.state;

    if (isConnect) {
      return (
        <div className="voz-living-peer-chat-body">
          <PeerChatMessages messages={messages} />
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
          onClick={() => this.connect()}
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
            onClick={() => this.toggleOpen()}
          >VOZLiving Peer Chat (Beta)</div>
          {this.renderChatBody()}
        </div>
      </div>
    );
  }
}

module.exports = PeerChat;
