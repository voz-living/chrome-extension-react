import { Component, PropTypes } from 'react';
import { GET } from '../utils/http';
// import $ from 'jquery';
/* eslint-disable new-cap */
class UserStyle extends Component {
  static propTypes = {
    userStyle: PropTypes.string,
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.userStyle !== this.props.userStyle;
  }

  componentWillUpdate(nextProps) {
    const userStyle = nextProps.userStyle;
    this.checkAddStyle(userStyle);
  }

  checkAddStyle(userStyleUrl) {
    try {
      const userStyleId = userStyleUrl.match(/\/styles\/(\d+)\//)[1];
      const storeId = `voz_living_userstyle_${userStyleId}`;
      const oldCss = window.localStorage.getItem(storeId);
      if (oldCss !== null) {
        this.addStyle(oldCss);
      }
      GET(`https://userstyles.org/styles/${userStyleId}.css`, {
        credentials: 'same-origin',
      })
        .then((css) => {
          if (oldCss === null) {
            this.addStyle(css);
            window.localStorage.setItem(storeId, css);
          } else {
            if (css !== oldCss) {
              window.localStorage.setItem(storeId, css);
              console.log('style updated');
            }
          }
        });
    } catch (e) {
      console.error(e);
    }
  }

  addStyle(css) {
    try {
      const styleTag = document.createElement('style');
      styleTag.type = 'text/css';
      styleTag.appendChild(document.createTextNode(css.replace(/@-moz-document.*{/g, '@media all {')));
      document.getElementsByTagName('head')[0].appendChild(styleTag);
    } catch (e) {
      console.error(e);
    }
  }

  render() { return null; }
}

export default UserStyle;
