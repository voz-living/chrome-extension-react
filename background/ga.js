var _AnalyticsCode = 'UA-98781531-1';
window._gaq = [];
window._gaq.push(['_setAccount', _AnalyticsCode]);
window._gaq.push(['_trackPageview']);
(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();
window._gaq.push(['_trackEvent', 'test', 'test']);

window.trackEvent = (category = 'unknown', action = 'unknown', label) => {
  window._gaq.push(['_trackEvent', category, action, label]);
  console.info('ga', '_trackEvent', category, action, label);
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.__ga === true) {
    trackEvent(request.category, request.action, request.label);
  }
});