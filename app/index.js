import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import VOZLivingLoader from './components/PageLoader';

document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    require('./styles/index.less'); // eslint-disable-line
    window.vozLivingLoader = VOZLivingLoader.init().start();

    const injector = document.createElement('div');
    injector.id = 'voz-living-app';
    document.body.appendChild(injector);
    render(<Root />, injector);
  }
};
