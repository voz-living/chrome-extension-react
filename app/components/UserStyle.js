import { getLocalSettings } from '../utils/settings';
import { GET } from '../utils/http';
// import $ from 'jquery';
/* eslint-disable new-cap */

function addStyle(css, storeId) {
  try {
    const styleTag = document.createElement('style');
    styleTag.type = 'text/css';
    styleTag.id = storeId;
    styleTag.appendChild(document.createTextNode(css.replace(/@-moz-document.*{/g, '@media all {')));
    document.getElementsByTagName('head')[0].appendChild(styleTag);
  } catch (e) {
    console.error(e);
  }
}

function checkAddStyle(userStyleUrl) {
  try {
    if (userStyleUrl === '') return;
    const userStyleId = userStyleUrl.match(/\/styles\/(\d+)\//)[1];
    const storeId = `voz_living_userstyle_${userStyleId}`;
    const oldCss = window.localStorage.getItem(storeId);
    if (oldCss !== null) {
      addStyle(oldCss, storeId);
      return;
    }
    GET(`https://userstyles.org/styles/${userStyleId}.css`, {
      credentials: 'same-origin',
    })
      .then((css) => {
        if (oldCss === null) {
          addStyle(css, storeId);
          window.localStorage.setItem(storeId, css);
        }
      });
  } catch (e) {
    console.error(e);
  }
}

export function UserStyle() {
  let isAdded = false;
  let uStyle = localStorage.getItem('userStyle');
  if (uStyle && uStyle !== '') {
    uStyle = uStyle.split(',');
    setTimeout(() => {
      for (const eachStyle of uStyle) {
        checkAddStyle(eachStyle);
      }
    }, 50);
    isAdded = true;
  }
  getLocalSettings()
    .then((settings) => {
      let { userStyle } = settings;
      if (userStyle && userStyle !== '' && !isAdded) {
        userStyle = userStyle.split(',');
        for (const eachStyle of userStyle) {
          checkAddStyle(eachStyle);
        }
      }
      localStorage.setItem('userStyle', userStyle);
    });
}
