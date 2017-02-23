import { Component, PropTypes } from 'react';
import $ from 'jquery';
import { proccessLink } from '../utils/link';

class LinkHelperControl extends Component {
  static propTypes = {
    linkHelper: PropTypes.bool,
  }

  componentWillReceiveProps(nextProps) {
    this.linkHelper(nextProps);
  }

  linkHelper(nextProps = this.props) {
    const { linkHelper } = nextProps;

    if (linkHelper) {
      const body = $('body');
      proccessLink(body);
    }
  }

  render() { return null; }
}

export default LinkHelperControl;
