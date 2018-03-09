import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import VOZLivingLoader from './components/PageLoader';
import { keepMeBaby } from './utils/migrationAsAnOption';
import { AdsControl } from './components/AdsControl';
import { UserStyle } from './components/UserStyle';
import EyesProtect from './components/EyesProtect/index';
import { getLocalSettings } from './utils/settings';

window.trackEvent = (category, action, label) => {
  chrome.runtime.sendMessage({ __ga: true, category, action, label });
};
trackEvent('view-content', location.href);

keepMeBaby();
AdsControl();
UserStyle();
getLocalSettings()
  .then((settings) => {
    const elem = document.createElement('div');
    elem.id = 'voz-living-blank';
    document.head.appendChild(elem);
    let { eyesSchedule, eyesDuration, enableDarkMode, enableWarmMode, lightAdjust, enableEyesNotify, delayEyesNotify, eyesDurationEnd } = settings;
    render(<EyesProtect
      eyesSchedule={eyesSchedule}
      eyesDuration={eyesDuration}
      eyesDurationEnd={eyesDurationEnd}
      enableDarkMode={enableDarkMode}
      enableWarmMode={enableWarmMode}
      lightAdjust={lightAdjust}
      enableEyesNotify={enableEyesNotify}
      delayEyesNotify={delayEyesNotify}
    />, elem);
  });

document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    window.vozLivingLoader = VOZLivingLoader.init();
    const injector = document.createElement('div');
    injector.id = 'voz-living-app';
    document.body.appendChild(injector);
    render(<Root />, injector);
  }
};
