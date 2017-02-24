import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import PeerChatTab from './PeerChat';

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
      render(<PeerChatTab />, injector);
    }
  }

  render() { return null; }
}

export default PeerChatControl;
