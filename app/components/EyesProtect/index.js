import React, { Component } from 'react';
import $ from 'jquery';

class EyesProtect extends Component {
  componentWillMount() {
    this.darkMode();
  }
  darkMode() {
    require('../../styles/dark-mode.less');
  }
  fluxMode() {
    return (
      <div
        className="voz-warm-filter"
        style={`
    background-color: rgba(218, 84, 6, 0.5);
    position: fixed;
    width: 120%;
    height: 120%;
    mix-blend-mode: multiply;
    z-index: 9999999;
    pointer-events: none;`}
      />
      );
  }
  eyeNotify() {
    return (
      <div className="voz-bao-ve-mat">
        <div style="position:fixed;height: 100%;width: 100%;top: 0;z-index: 99;background: rgba(0, 0, 0, 0.8);font-size:15px" />
          <div style="text-align:center;padding: 50px;background-color: #4286f4;color: white;  position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index:99;font-size:15px">
              <strong> Vì một đôi mắt khoẻ mạnh, các thím hãy cùng nhau không nhìn vào máy tính trong lúc này nào! </strong>
              <img style="vertical-align:middle" src="https://vozforums.com/images/smilies/Off/byebye.gif" /><br />
              <strong> Thông báo này sẽ tự tắt sau </strong><strong className="dem-nguoc"></strong>
              <div className="eyes-close" style="position:absolute;width:150px;height:50px;background-color:green;right:0;bottom:0;cursor:pointer; display:flex;align-items: center; justify-content:center;">Tắt thông báo</div>
          </div>
      </div>
            );
  }
  render() { return null; }
}

export default EyesProtect ;
