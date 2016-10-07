import React, { Component, PropTypes } from 'react';
import { proccessLink } from '../utils/link';
import $ from 'jquery';

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
    proccessLink($('[id^="post_message"]', html), true);
    return <div dangerouslySetInnerHTML={{ __html: html.html() }}></div>;
  }
}

export default PostContent;
