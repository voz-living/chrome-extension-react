import { Component, PropTypes } from 'react';
import $ from 'jquery';

class PeerChat{
  constructor() {
    
  }
}

class PeerChatControl extends Component {
  static propTypes = {
    isPeerChat: PropTypes.bool,
  }

  static defaultProps = {
    isPeerChat: true,
  }

  componentWillReceiveProps(nextProps) {
    this.addPeerChat(nextProps);
  }

  addPeerChat(nextProps = this.props) {
    const { isPeerChat } = nextProps;

    if (isPeerChat) {
    }
  }

  render() { return null; }
}

export default PeerChatControl;
