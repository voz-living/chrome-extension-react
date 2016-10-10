import $ from 'jquery';

export function getCurrentView() {
  let currentView = null;
  if (/forumdisplay/.test(window.location.pathname)) {
    currentView = 'thread-list';
  } else if (/showthread/.test(window.location.pathname)) {
    currentView = 'thread';
  } else if (/newreply/.test(window.location.pathname)) {
    currentView = 'new-reply';
  }
  return currentView;
}

export function getAuthenticationInformation() {
  const queryString = "*:contains('You last') > *:contains('Welcome') > a[href*='member.php?u']";
  const username = $(queryString).eq(0).text();
  if (username === '') return { isLogin: false };
  new Function(
    $("script:not([src]):contains('SECURITYTOKEN')")
      .text()
      .replace('SECURITYTOKEN', 'SECURITYTOKEN=window.SECURITYTOKEN')
    ).call(window);
  const token = window.SECURITYTOKEN;
  return { isLogin: true, token, username };
}
