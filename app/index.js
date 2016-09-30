import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import $ from 'jquery';

$(window.document).ready(() => {
  const injector = document.createElement('div');
  injector.id = 'voz-living-app';
  document.body.appendChild(injector);
  render(<Root />, injector);
});
