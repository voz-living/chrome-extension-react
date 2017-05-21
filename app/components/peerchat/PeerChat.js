import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { toClassName } from '../../utils';
import _ from 'lodash';

import PeerChatMessages from './PeerChatMessages';
import EmotionPicker from '../EmotionPicker';

const STORAGE_KEY = 'voz_living_peerchat';
const CONNECT_KEY = 'voz_living_peerchat_isconnect';

@autobind
class PeerChat extends Component {
  static propTypes = {
    authInfo: PropTypes.object,
    maxMessageNumber: PropTypes.number,
  }

  constructor(props) {
    super(props);

    const isConnectSession = !!this.sessionStorageGet(CONNECT_KEY);

    this.state = {
      messages: this.sessionStorageGet(STORAGE_KEY) || [],
      sendMessage: '',
      isConnect: isConnectSession,
      isOpen: isConnectSession,
      isMaximized: false,
      isShowEmotionBox: false,
    };

    this.inputSendMessage = null;
    this.throttledMessagesUpdate = _.throttle(this.updateMessageToStorage.bind(this), 300);

    this.addIncomeMessageListener();
  }

  sessionStorageSet(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }

  sessionStorageGet(key) {
    const store = window.sessionStorage.getItem(key);
    return JSON.parse(store);
  }

  addIncomeMessageListener() {
    chrome.runtime.onMessage.addListener((request) => {
      const { peerChatIncomeMessage } = request;
      if (peerChatIncomeMessage) {
        this.setState({ messages: [...this.state.messages, peerChatIncomeMessage] });
        this.throttledMessagesUpdate();
      }
    });
  }

  updateMessageToStorage() {
    setTimeout(() => this.sessionStorageSet(STORAGE_KEY, this.state.messages), 100);
  }

  clearMessageStorage() {
    this.sessionStorageSet(STORAGE_KEY, JSON.stringify([]));
  }

  connect() {
    // connect socket establish room connection
    this.setState({ isConnect: true });
    this.sessionStorageSet(CONNECT_KEY, 'true');
    chrome.runtime.sendMessage({ peerChatConnect: true });
  }

  disconnect() {
    // disconnect all socket
    this.setState({
      isConnect: false, messages: [], sendMessage: '', isOpen: false, isShowEmotionBox: false,
    });
    this.sessionStorageSet(CONNECT_KEY, 'false');
    chrome.runtime.sendMessage({ peerChatDisconnect: true });
    this.clearMessageStorage();
  }

  send() {
    const { sendMessage, messages } = this.state;
    const { maxMessageNumber } = this.props;
    const cleanMessage = sendMessage.trim();

    if (cleanMessage.length > 250) {
      window.alert('Tin nhắn của bạn không được dài quá 250 ký tự.');
      return;
    }

    if (cleanMessage !== '') {
      const newMessage = {
        name: this.props.authInfo.username,
        timeStamp: new Date().getTime(),
        message: sendMessage,
      };

      const newMessages = _.cloneDeep(messages);

      if (messages.length >= maxMessageNumber) newMessages.shift();

      // send message tab -> background -> send
      chrome.runtime.sendMessage({
        peerChatSendMessage: newMessage,
      }, this.setState({
        sendMessage: '',
        messages: [...newMessages, newMessage],
        isShowEmotionBox: false,
      }));

      this.throttledMessagesUpdate();
    }
  }

  handleChange(event) {
    const message = event.target.value;
    const last = message.length - 1;

    if (message[last] && message[last] === ':') {
      this.setState({ sendMessage: message, isShowEmotionBox: true });
    } else {
      if (message[last] === ' ' && this.state.isShowEmotionBox) {
        this.setState({ isShowEmotionBox: false });
      }
      this.setState({ sendMessage: message });
    }
  }

  handleKeyUp(event) {
    if (event.keyCode === 13) this.send();
  }

  toggleOpen() {
    const { isOpen } = this.state;
    if (isOpen) return;
    if (isOpen) this.disconnect();
    this.setState({ isOpen: !isOpen });
  }

  toggleEmotionBox() {
    this.setState({ isShowEmotionBox: !this.state.isShowEmotionBox });
  }

  appendInput(emotion) {
    let { sendMessage } = this.state;
    const last = sendMessage.length - 1;

    if (sendMessage[last] !== ' ') {
      if (sendMessage[last] === ':') sendMessage = sendMessage.substring(0, last - 1);
      this.setState({
        sendMessage: `${sendMessage} ${emotion.text} `,
        isShowEmotionBox: false,
      });
    } else {
      this.setState({
        sendMessage: `${sendMessage || ''}${emotion.text} `,
        isShowEmotionBox: false,
      });
    }
    if (this.inputSendMessage) this.inputSendMessage.focus();
  }

  renderChatBody() {
    const { isConnect, sendMessage, messages, isShowEmotionBox } = this.state;

    if (isConnect) {
      return (
        <div className="voz-living-peer-chat-body">
          <PeerChatMessages messages={messages} />
          {isShowEmotionBox ? <EmotionPicker onIconClick={this.appendInput} /> : null}
          <div className="voz-living-peer-chat-input">
            <input
              type="text" value={sendMessage}
              onChange={this.handleChange}
              onKeyUp={this.handleKeyUp}
              ref={(inpt) => { this.inputSendMessage = inpt; }}
            />
            <button onClick={this.toggleEmotionBox}>Emo</button>
            <button onClick={this.send}>Send</button>
          </div>
        </div>
      );
    }

    return (
      <div className="voz-living-peer-chat-body">
        <div
          className="voz-living-peer-chat-connect"
          onClick={() => this.connect()}
        > VOZLiving <br />
          Peer Chat - Beta <br />
          <i className="fa fa-connectdevelop fa-3"></i> <br />
          <small>Click để chat với Vozer khác!!!</small>
          <div className="voz-living-chat-description">
            * Chat P2(M)P bằng phương thức WebRTC, nội dung chat không thông qua bất kì server nào mà tới thẳng người nhận
            <br />* Id của người chat được tự động lấy theo tên đăng nhập voz, có thể bị can thiệp. Đề phòng giả id</div>
        </div>
      </div>
    );
  }

  render() {
    const { isOpen, isConnect, isMaximized } = this.state;

    return (
      <div
        className={toClassName({
          'voz-living-peer-chat-wrapper': true, open: isOpen, 'vlpc-maximized': isMaximized })}
      >
        <div className="voz-living-peer-chat">
          <div
            className="voz-living-peer-chat-header"
            onClick={() => this.toggleOpen()}
          >VOZLiving Peer Chat (Beta)
          &nbsp;{isConnect ?
            <a
              href="javascript:void(0)"
              data-tooltip="Disconnect"
              className="voz-living-peerchat-off"
              onClick={() => this.disconnect()}
            ><i className="fa fa-power-off" />
            </a> : null}
          &nbsp;{isOpen ?
            <a
              href="javascript:void(0)"
              data-tooltip="Maximize Toggle"
              className="voz-living-peerchat-max"
              onClick={() => this.setState({ isMaximized: !this.state.isMaximized })}
            ><i className="fa fa-desktop" />
            </a> : null}
          </div>
          {this.renderChatBody()}
        </div>
      </div>
    );
  }
}

module.exports = PeerChat;
