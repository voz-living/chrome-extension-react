import $ from 'jquery';

export function getCurrentView() {
  let currentView = null;
  if (/forumdisplay/.test(window.location.pathname)) {
    currentView = 'thread-list';
  } else if (/showthread/.test(window.location.pathname)) {
    currentView = 'thread';
  } else if (/showpost/.test(window.location.pathname)) {
    currentView = 'post';
  } else if (/newreply/.test(window.location.pathname)) {
    currentView = 'new-reply';
  } else if (/editpost/.test(window.location.pathname)) {
    currentView = 'edit-reply';
  } else if (/showpm/.test(window.location.href)) {
    currentView = 'pm';
  } else if (/insertpm/.test(window.location.href)) {
    currentView = 'insert-pm';
  } else if (/newthread/.test(window.location.href)) {
    currentView = 'new-thread';
  }
  return currentView;
}

export function getAuthenticationInformation() {
  const queryString = "*:contains('You last') > *:contains('Welcome') > a[href*='member.php?u']";
  const $user = $(queryString).eq(0);
  const username = $(queryString).eq(0).text();
  let userId = -1;
  try {
    userId = $user.attr('href').match(/u=(\d+)/)[1]
  } catch (e) {
    // ignore
  }
  if (username === '') {
    if ($('#nologin-message').length === 0) {
      $('.tborder:has(input[name="vb_login_username"])')
        .before(`<div id='nologin-message'>Bạn cần phải đăng nhập để sử dụng đầy đủ các chức năng của plugin</div>`);
    }
    return {
      isLogin: false,
    };
  }
  new Function(
    $("script:not([src]):contains('SECURITYTOKEN')")
    .text()
    .replace('SECURITYTOKEN', 'SECURITYTOKEN=window.SECURITYTOKEN')
  ).call(window);
  const token = window.SECURITYTOKEN;
  return {
    isLogin: true,
    token,
    username,
    userId,
  };
}

export const toClassName = (obj) => Object
  .keys(obj)
  .reduce((list, name) => (obj[name] ? list.concat([name]) : list), [])
  .join(' ');
