const io = require('socket.io-client');
const P2P = require('socket.io-p2p');

class PeerChatBackGround {
  constructor(url) {
    this.socket = null;
    this.p2p = null;
    this.url = url;
    this.numClients = 100;

    // Send Chat Message listener tab -> runtime -> send
    chrome.runtime.onMessage.addListener((request) => {
      if (request.peerChatSendMessage) {
        this.sendPeerMessage(request.peerChatSendMessage);
      }
      if (request.peerChatConnect) {
        this.log('Connect');
        this.connect();
      }
      if (request.peerChatDisconnect) {
        this.log('Disconnect');
        this.disconnect();
      }
    });
  }

  connect() {
    if (this.url && this.socket === null && this.p2p === null) {
      this.socket = io(this.url);
      this.p2p = new P2P(this.socket, { numClients: this.numClients }, () => {
        this.p2p.usePeerConnection = true;
        this.p2p.emit('peer-obj', { peerId: this.p2p.peerId });
      });

      this.socket.on('disconnect', () => this.log('Socket Disconnected'));

      // this event will be triggered over the socket transport
      // until `usePeerConnection` is set to `true`
      this.p2p.on('peer-msg', (data) => {
        this.log('Receive Chat Message', data.message);
        this.receivePeerMessage(data.message);
      });
    }
  }

  disconnect() {
    if (this.socket && this.p2p) {
      this.p2p.disconnect();
      this.socket.disconnect();
      this.p2p = null;
      this.socket = null;
    }
  }

  sendPeerMessage(message) {
    if (this.p2p) {
      this.log('Send Message', message);
      this.p2p.emit('peer-msg', { message });
    }
  }

  receivePeerMessage(message) {
    // Receive message from peer -> runtime -> tabs
    /* eslint-disable no-undef */
    chrome.tabs.query({ url: '*://vozforums.com/*' }, tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { peerChatIncomeMessage: message });
      });
    });
    /* eslint-enable no-undef */
  }

  joinRoom(room) {
    if (this.socket) {
      this.log('Join Room', room);
      this.socket.emit('join-room', room);
    }
  }

  log() {
    /* eslint-disable */
    arguments[0] = `[VOZliving] ${arguments[0]}`;
    console.log.apply(console, arguments);
    /* eslint-enable */
  }
}

module.exports = PeerChatBackGround;
