/* eslint-disable max-len */
import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { autobind } from 'core-decorators';
import WarmMode from './WarmMode';
import EyesNotify from './EyesNotify';
import { getChromeLocalStore, setChromeLocalStore } from '../../utils/settings';
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
    delayEyesNotify: PropTypes.string,
  }
  constructor(props) {
    super(props);
    const date = new Date();
    this.eyesTime = parseInt(date.getTime(), 10);
    this.curTime = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  }
  darkMode() {
    require('../../styles/dark-mode.less');
  }
  eyesFunc(nextProps = this.props) {
    const { eyesSchedule, eyesDuration, eyesDurationEnd, enableDarkMode, enableWarmMode, enableEyesNotify, delayEyesNotify } = nextProps;
    let { lightAdjust } = nextProps;
    let delayMinutes = parseInt(delayEyesNotify * 60 * 1000, 10);
    const scheduledFunc = () => {
      if (enableDarkMode) { this.darkMode(); }
      if (enableWarmMode) {
        const wrapper = document.createElement('div');
        wrapper.id = 'voz-warm-wrapper';
        document.body.appendChild(wrapper);
        if (lightAdjust.length <= 0) { lightAdjust = 0.4; } else
          if (lightAdjust > 0.5) { lightAdjust = 0.5; } else
          if (lightAdjust < 0.2) { lightAdjust = 0.2; }
          // console.log(this.curTime);
        if (this.curTime >= 22500 && this.curTime < 62100) {
          lightAdjust *= 0.5;
        } else
        if (this.curTime >= 62100 && this.curTime < 63900 || (this.curTime >= 19800 && this.curTime < 22500)) {
          lightAdjust *= 0.6;
        } else
        if (this.curTime >= 62100 && this.curTime < 63900) {
          lightAdjust *= 0.7;
        } else
        if (this.curTime >= 63900 && this.curTime < 64800 || (this.curTime >= 17100 && this.curTime < 19800)) {
          lightAdjust *= 0.8;
        } else
        if (this.curTime >= 64800 && this.curTime < 65700) {
          lightAdjust *= 0.9;
        }
        render(<WarmMode lightAdjust={lightAdjust} />, wrapper);
      }
    };
    if (eyesSchedule === false || eyesDuration.length <= 0 || eyesDurationEnd.length <= 0 || eyesDuration === eyesDurationEnd) {
      scheduledFunc();
    } else {
      const durationS = eyesDuration.split(':').reduce((a, b) => a * 3600 + b * 60);
      const durationE = eyesDurationEnd.split(':').reduce((a, b) => a * 3600 + b * 60);
      // console.log([this.curTime, durationS, durationE]);
      if (durationS < durationE) {
        if (this.curTime >= durationS && this.curTime <= durationE) {
          scheduledFunc();
        }
      } else {
        if (this.curTime >= durationS || this.curTime <= durationE) {
          scheduledFunc();
        }
      }
    }
    if (enableEyesNotify) {
      if (delayMinutes.length <= 0) { delayMinutes = 900000; } else
        if (delayMinutes > 21600000) { delayMinutes = 21600000; } else
        if (delayMinutes < 900000) { delayMinutes = 900000; }
      const eyesWrap = document.createElement('div');
      eyesWrap.id = 'voz-eyes-notify';
      document.body.appendChild(eyesWrap);
      getChromeLocalStore(['delayEyesNotifyStamp'])
            .then((value) => {
              // console.log([this.eyesTime, value.delayEyesNotifyStamp, delayMinutes]);
              if (this.eyesTime < value.delayEyesNotifyStamp && value.delayEyesNotifyStamp - this.eyesTime <= 21700000) {
                setTimeout(() => {
                  setChromeLocalStore({ delayEyesNotifyStamp: this.eyesTime + delayMinutes });
                  render(<EyesNotify />, eyesWrap);
                  setInterval(() => {
                    setChromeLocalStore({ delayEyesNotifyStamp: this.eyesTime + delayMinutes });
                    render(<EyesNotify />, eyesWrap);
                  }, delayMinutes);
                }, value.delayEyesNotifyStamp - this.eyesTime);
              } else {
                setChromeLocalStore({ delayEyesNotifyStamp: this.eyesTime + delayMinutes });
                setInterval(() => {
                  render(<EyesNotify />, document.getElementById('voz-eyes-notify'));
                }, delayMinutes);
              }
            });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.eyesFunc(nextProps);
    getChromeLocalStore(['delayEyesNotify'])
        .then((value) => {
          if (value.delayEyesNotify !== nextProps.delayEyesNotify) {
            setChromeLocalStore({ delayEyesNotify: nextProps.delayEyesNotify });
            setChromeLocalStore({ delayEyesNotifyStamp: this.eyesTime + parseInt(nextProps.delayEyesNotify, 10) * 1000 * 60 });
          }
        });
  }

  render() {
    return null; 
  }
}

export default EyesProtect ;
