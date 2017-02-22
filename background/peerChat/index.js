const P2P = require('socket.io-p2p');
const io = require('socket.io-client');

class PeerChatBackGround {
  constructor(url) {
    console.log('VOZLiving setup socket peer chat');

    this.socket = io(url);
    this.p2p = new P2P(this.socket);

    this.p2p.on('ready', () => {
      this.p2p.usePeerConnection = true;
      this.p2p.emit('peer-obj', { peerId: this.p2p.peerId });
    });

    // this event will be triggered over the socket transport
    // until `usePeerConnection` is set to `true`
    this.p2p.on('peer-msg', (data) => {
      this.receivePeerMessage(data.message || '');
    });
  }

  receivePeerMessage(message) {
    /* eslint-disable no-undef */
    chrome.tabs.query({ url: '*://vozforums.com/*' }, tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { message });
      });
    });
    /* eslint-enable no-undef */
  }

  sendPeerMessage(message) {
    this.p2p.emit('peer-msg', { message });
  }
}

module.exports = PeerChatBackGround;
