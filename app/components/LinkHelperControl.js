import { Component, PropTypes } from 'react';
import $ from 'jquery';
import { proccessLink } from '../utils/link';

class LinkHelperControl extends Component {
  static propTypes = {
    linkHelper: PropTypes.bool,
    pageStatusId: PropTypes.number,
  }

  componentWillReceiveProps(nextProps) {
    this.linkHelper(nextProps);
  }

  linkHelper(nextProps = this.props) {
    const { linkHelper, pageStatusId } = nextProps;

    if (linkHelper && pageStatusId !== this.props.pageStatusId) {
      const body = $('body');
      proccessLink(body);
    }
  }

  render() { return null; }
}

export default LinkHelperControl;
