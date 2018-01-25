import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import VOZLivingLoader from './components/PageLoader';
window.trackEvent = (category, action, label) => {
  chrome.runtime.sendMessage({ __ga: true, category, action, label });
};
trackEvent('view-content', location.href);

document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    window.vozLivingLoader = VOZLivingLoader.init().start();

    const injector = document.createElement('div');
    injector.id = 'voz-living-app';
    document.body.appendChild(injector);
    render(<Root />, injector);
  }
};
