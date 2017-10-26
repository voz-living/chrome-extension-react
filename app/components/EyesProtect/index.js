/* eslint-disable max-len */
import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { autobind } from 'core-decorators';
import WarmMode from './WarmMode';
import EyesNotify from './EyesNotify';
@autobind
class EyesProtect extends Component {
  static propTypes = {
    eyesSchedule: PropTypes.bool,
    eyesDuration: PropTypes.string,
    eyesDurationEnd: PropTypes.string,
    enableDarkMode: PropTypes.bool,
    enableWarmMode: PropTypes.bool,
    lightAdjust: PropTypes.string,
    enableEyesNotify: PropTypes.bool,
    delayEyesNotify: PropTypes.number,
  }
  constructor(props) {
    super(props);
  }
  darkMode() {
    require('../../styles/dark-mode.less');
  }
  eyesFunc(nextProps = this.props) {
    const { eyesSchedule, eyesDuration, eyesDurationEnd, enableDarkMode, enableWarmMode, lightAdjust, enableEyesNotify, delayEyesNotify } = nextProps;
    if (enableDarkMode) { this.darkMode(); }
    if (enableWarmMode) {
      const wrapper = document.createElement('div');
      wrapper.id = 'voz-warm-wrapper';
      document.body.appendChild(wrapper);
      render(<WarmMode lightAdjust={lightAdjust} />, wrapper);
    }
    if (enableEyesNotify) {
      const eyesWrap = document.createElement('div');
      eyesWrap.id = 'voz-eyes-notify';
      document.body.appendChild(eyesWrap);
      render(<EyesNotify />, eyesWrap);
    }
  }
  componentWillReceiveProps(nextProps) {
    this.eyesFunc(nextProps);
  }

  render() { return null; }
}

export default EyesProtect ;
