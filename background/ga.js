// var _AnalyticsCode = 'UA-98781531-1';
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-98781531-1', 'auto');
ga('set', 'transport', 'beacon');
ga('set', 'checkProtocolTask', () => {});
ga('send', 'pageview');
let clientId = '';
ga(function(tracker) {
  const cid = tracker.get('clientId');
  const s = cid.split('.');
  const tmp = new Array(s[0].length*2);
  for (let i = 0; i < s[0].length; i++) {
    tmp.push(s[0][i]);
    tmp.push(s[1][i]);
  }
  clientId = tmp.join('');
  console.log(clientId);
});

window.trackEvent = (category = 'unknown', action = 'unknown', label) => {
  // window._gaq.push(['_trackEvent', category, action, label]);
  ga('send', 'event', category, action, label);
  console.info('ga', '_trackEvent', category, action, label);
};
trackEvent('test2', 'test2-2');

chrome.runtime.onMessage.addListener((request) => {
  if (request.__ga === true) {
    trackEvent(request.category, request.action, request.label);
  }
});

let bgUserId = -1;
function sendUserId(userId) {
  if (userId !== bgUserId) {
    bgUserId = userId;
    ga('set', 'userId', bgUserId);
  }
}

chrome.storage.local.get('authInfo', (storage) => {
  const { userId } = storage.authInfo;
  if (userId && userId.length > 0) {
    sendUserId(userId);
  }
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (changes.authInfo) {
    const { userId } = changes.authInfo.newValue;
    sendUserId(userId);
  }
});
