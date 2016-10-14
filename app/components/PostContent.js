import React, { Component, PropTypes } from 'react';
import { proccessLink } from '../utils/link';
import $ from 'jquery';

class PostContent extends Component {
  static propTypes = {
    html: PropTypes.any,
    isLoading: PropTypes.bool,
  }

  static defaultProps = {
    html: null,
  }

  render() {
    const { html, isLoading } = this.props;
    if (html === null) return null;
    if (isLoading) {
      return (
        <div style={{ textAlign: 'center' }}>
          <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" aria-hidden="true"></i>
        </div>
      );
    }
    proccessLink($('[id^="post_message"]', html), true);
    return <div dangerouslySetInnerHTML={{ __html: html.html() }}></div>;
  }
}

export default PostContent;
