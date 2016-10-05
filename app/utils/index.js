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
