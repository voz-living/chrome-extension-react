import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
const cheerio = require('cheerio');
import {
  GET,
} from '../../utils/http';
/* eslint-disable new-cap */

export default class LazyPost extends Component {
  static propTypes = {
    postId: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loading: false,
      html: '',
    };
  }

  componentDidMount() {
    this.getPost();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.postId !== this.props.postId || !_.isEqual(nextState, this.state);
  }

  getPost() {
    this.loadPost();
  }

  loadPost() {
    this.setState({ loading: true });
    GET(`//vozforums.com/showpost.php?p=${this.props.postId}`)
      .then((html) => {
        const $ = cheerio.load(html);
        this.setState({
          html: { __html: $.html('.voz-postbit') },
          loaded: true,
          loading: false,
        });
      });
  }

  render() {
    if (this.state.loaded && this.state.loading === false) {
      return <div dangerouslySetInnerHTML={this.state.html}></div>;
    } else if (this.loading) {
      return <div>Loading post {this.props.postId}</div>;
    }
    return <div></div>;
  }
}
