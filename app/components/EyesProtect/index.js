/* eslint-disable max-len */
import React, { Component } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { autobind } from 'core-decorators';
@autobind
class EyesProtect extends Component {
  constructor(props) {
    super(props);
    this.state = { timer: 30 };
  }
  componentWillMount() {
    this.darkMode();
    const wrapper = document.createElement('div');
    wrapper.id = 'voz-warm-wrapper';
    document.body.appendChild(wrapper);
    render(this.warmMode(), wrapper);
    const eyesWrap = document.createElement('div');
    wrapper.appendChild(eyesWrap);
    render(this.eyeNotify(), eyesWrap);
  }
  darkMode() {
    require('../../styles/dark-mode.less');
  }
  warmMode() {
    document.documentElement.style.backgroundColor = '#111111';
    return (
      <div
        className="voz-warm-filter"
        style={{
          backgroundColor: 'rgba(218, 84, 6, 0.5)',
          position: 'fixed',
          width: '120%',
          height: '120%',
          top: '0',
          left: '0',
          mixBlendMode: 'multiply',
          zIndex: '9999999',
          pointerEvents: 'none' }}
      />
      );
  }
  countDown() {
    let { timer } = this.state;
    setInterval(() => {
      if (timer > 0) {
        this.setState({ timer });
        timer -= 1;
      }
      console.log(timer);
    }, 1000);
    return { timer };
}
  eyeNotify() {
    this.countDown();
    return (
      <div className="voz-bao-ve-mat">
        <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0, zIndex: 9999, background: 'rgba(0, 0, 0, 0.8)', fontSize: '15px' }} />
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#4286f4', color: 'white', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10000, fontSize: '15px' }}>
          <strong> Vì một đôi mắt khoẻ mạnh, các thím hãy cùng nhau không nhìn vào máy tính trong lúc này nào! </strong>
          <img style={{ verticalAlign: 'middle' }} src="https://vozforums.com/images/smilies/Off/byebye.gif" /><br />
          <strong> Thông báo này sẽ tự tắt sau </strong>
          <strong className="dem-nguoc">{this.state.timer} giây</strong>
          <div className="eyes-close" onClick={() => $('.voz-bao-ve-mat').remove()} style={{ position: 'absolute', width: '150px', height: '50px', backgroundColor: 'green', right: 0, bottom: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Tắt thông báo</div>
        </div>
      </div>
            );
  }
  render() { return null; }
}

export default EyesProtect ;
