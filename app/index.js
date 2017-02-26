import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import VOZLivingLoader from './components/PageLoader';
// const test = 1;
document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    window.vozLivingLoader = VOZLivingLoader.init().start();

    const injector = document.createElement('div');
    injector.id = 'voz-living-app';
    document.body.appendChild(injector);
    render(<Root />, injector);
  }
};
