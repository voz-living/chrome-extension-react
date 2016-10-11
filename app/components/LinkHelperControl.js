import { Component, PropTypes } from 'react';
import $ from 'jquery';
import { proccessLink } from '../utils/link';

class LinkHelperControl extends Component {
  static propTypes = {
    linkHelper: PropTypes.bool,
    currentView: PropTypes.string,
  }

  componentWillReceiveProps(nextProps) {
    this.linkHelper(nextProps);
  }

  linkHelper(nextProps = this.props) {
    const { linkHelper, currentView } = nextProps;

    if (linkHelper && currentView === 'thread') {
      const body = $('body');
      proccessLink(body);
    }
  }

  render() { return null; }
}

export default LinkHelperControl;
