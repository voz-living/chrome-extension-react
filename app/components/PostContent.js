import React, { Component, PropTypes } from 'react';
import { proccessLink } from '../utils/link';

class PostContent extends Component {
  static propTypes = {
    html: PropTypes.any,
  }

  static defaultProps = {
    html: null,
  }

  render() {
    const { html } = this.props;
    if (html === null) return null;

    const content = proccessLink(html, true);
    return <div dangerouslySetInnerHTML={{ __html: content.html() }}></div>;
  }
}

export default PostContent;
