/* eslint-disable max-len */
import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { setChromeLocalStore } from '../utils/settings';
import { autobind } from 'core-decorators';
import _ from 'lodash';


@autobind
class MultiAccounts extends Component {
  static propTypes = {
    cookieList: PropTypes.array,
    currentView: PropTypes.string,
    exportPass: PropTypes.string,
  };

  static defaultProps = {
    cookieList: [],
  };

  constructor(props) {
    super(props);
    const pass = this.props.exportPass || null;
    this.state = {
      isOpen: false,
      cookieList: this.props.cookieList,
      exportPass: pass,
    };
  }

  componentDidMount() {
    const uDir = document.querySelector('.tborder .alt2 > .smallfont > strong > a');
    let uName = null;
    if (uDir !== null) {
      uName = this.normalizeText(uDir.textContent);
    }
    const { currentView } = this.props;
    const { cookieList } = this.state;
    if (uDir !== null && (currentView === 'thread' || currentView === 'new-thread' || currentView === 'new-reply')) {
      let postButton;
      let thread;
      if (currentView === 'thread') {
        thread = document.querySelector('#qr_threadid').value;
      } else if (currentView === 'new-thread') {
        thread = window.location.href.match(/f=(\d+)$/i)[1];
      } else {
        thread = document.querySelector('.panelsurround input[name="t"]').value;
      }
      if (currentView === 'thread') {
        postButton = document.querySelector('.button#qr_submit');
      } else {
        postButton = document.querySelector('.button#vB_Editor_001_save');
      }
      postButton.style.display = 'none';
      postButton.id = '';
      postButton.insertAdjacentHTML('beforebegin',
        '<span id="vl-account-menu" style="margin-right:3px;"></span>');
      render(
        <span>
          <select style={{ marginRight: '3px' }}>
            <option key="default" value="default">{uDir.textContent}</option>
            {cookieList.map((cookie, i) => {
              return (this.normalizeText(cookie.username) !== uName && cookie.verified)
                ? <option key={i} value={i}>{cookie.username}</option>
                : '';
            })}
          </select>
          <button
            className="button vl-button"
            id={currentView === 'thread' ? 'qr_submit' : 'vB_Editor_001_save'}
            onClick={e => {
              const elem = document.querySelector('#vl-account-menu select');
              const value = elem.options[elem.selectedIndex].value;
              if (value !== 'default') {
                e.preventDefault();
                this.postMessage(thread, currentView, cookieList[value].sessHash, cookieList[value].passHash, cookieList[value].idHash);
              }
            }}
          >{currentView === 'new-thread' ? 'Submit New Thread' : 'Post Reply'}</button>
        </span>
        , document.getElementById('vl-account-menu'));
    }
  }

  handleChange(event, i, type) {
    const { cookieList } = this.state;
    if (type === 'username') {
      cookieList[i].username = event.target.value;
    } else
    if (type === 'password') {
      cookieList[i].password = event.target.value;
    }
  }

  addNewAccount() {
    const { cookieList } = this.state;
    cookieList.push({ username: '', password: '', sessHash: '', passHash: '', idHash: '', verified: false, icon: 'fa-question-circle' });
    this.setState({ cookieList });
  }

  removeAccount(i) {
    const { cookieList } = this.state;
    cookieList.splice(i, 1);
    this.setState({ cookieList });
  }

  verifyAccount(username, password, i) {
    const { cookieList } = this.state;
    cookieList[i].icon = 'fa-spinner fa-spin';
    this.setState({ cookieList });
    chrome.runtime.sendMessage({ service: 'get-session-hash', request: { username, password } }, response => {
      if (response.resolve) {
        cookieList[i].sessHash = response.resolve.sessHash;
        cookieList[i].passHash = response.resolve.passHash;
        cookieList[i].idHash = response.resolve.idHash;
        cookieList[i].verified = true;
        cookieList[i].icon = 'fa-check';
      } else if (response.reject) {
        cookieList[i].icon = 'fa-exclamation-triangle';
        alert('Something went wrong.');
      }
      this.setState({ cookieList });
    });
  }

  changeAccount(sessHash, passHash, idHash) {
    const { cookieList } = this.state;
    setChromeLocalStore({ cookieList });
    chrome.runtime.sendMessage({ service: 'set-session-hash', request: { sessHash, passHash, idHash } });
    setTimeout(() => { location.reload(); }, 100);
  }

  modifyPassword() {
    document.getElementById('vl-require-export-pass').style.display = 'none';
    console.log(this.state.exportPass);
    if (this.state.exportPass === null) {
      document.getElementById('vl-add-pass').style.display = 'inline-block';
    } else {
      document.getElementById('vl-remove-pass').style.display = 'inline-block';
    }
  }

  addExportPassword() {
    if (this.state.exportPass === null) {
      const addPass = prompt('Hãy nhập pass bảo mật bạn muốn(Nhớ lưu pass này ra nơi nào đó):');
      if (addPass !== null) {
        const reAddPass = prompt('Hãy nhập lại pass:');
        if (reAddPass !== null) {
          if (addPass === reAddPass) {
            setChromeLocalStore({ exportPass: addPass });
            this.setState({ exportPass: addPass });
            alert('Xác nhận pass thành công.');
          } else {
            alert('Pass không trùng nhau.');
          }
        }
      }
    }
    document.getElementById('vl-require-export-pass').style.display = 'inline';
    document.getElementById('vl-add-pass').style.display = 'none';
  }

  removeExportPassword() {
    const pass = prompt('Hãy nhập pass bảo mật');
    if (pass !== null) {
      if (pass === this.state.exportPass) {
        setChromeLocalStore({ exportPass: null });
        this.setState({ exportPass: null });
        alert('Pass bảo mật đã được xoá');
      } else {
        alert('Bạn đã nhập sai pass');
      }
    }
    document.getElementById('vl-require-export-pass').style.display = 'inline';
    document.getElementById('vl-remove-pass').style.display = 'none';
  }

  exportAccount() {
    if (this.state.cookieList.length === 0) {
      alert('Không có gì để export');
      return null;
    }
    if (this.state.exportPass !== null) {
      const pass = prompt('Hãy nhập pass bảo mật');
      if (pass !== null) {
        if (pass !== this.state.exportPass) {
          alert('Bạn đã nhập sai pass');
          return null;
        }
      } else {
        return null;
      }
    }
    const elem = document.createElement('input');
    document.body.appendChild(elem);
    const nopass = confirm('Bạn có muốn extract không bao gồm mật khẩu không?');
    if (nopass === true) {
      elem.setAttribute('value', JSON.stringify(this.state.cookieList.map(arr => {
        const newArr = Object.assign({}, arr);
        newArr.password = null;
        return newArr;
      })));
    } else {
      elem.setAttribute('value', JSON.stringify(this.state.cookieList));
    }
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
    alert('Tài khoản đã được export ra clipboard.');
    return null;
  }

  importAccount() {
    const method = prompt('Chọn kiểu import bạn muốn:\n1. Thay thế\n2. Thêm vào');
    if (method !== null) {
      if (method !== '1' && method !== '2') {
        alert('Lựa chọn không hợp lệ');
        return null;
      }
      const input = prompt('Nhập tài khoản export được tại đây:');
      if (input === '') {
        alert('Bạn chưa nhập gì cả.');
      } else if (input !== null) {
        try {
          JSON.parse(input);
        } catch (e) {
          alert('Định dạng nhập vào không đúng');
          return null;
        }
        const content = JSON.parse(input);
        if (content.length === 0 || Object.keys(content).length === 0) {
          alert('Bạn chưa nhập gì cả.');
          return null;
        }
        const params = ['username', 'password', 'sessHash', 'passHash', 'idHash', 'verified', 'icon'];
        for (let i = 0; i < content.length; i++) {
          if (_.intersection(_.keys(content[i]), params).length < 7) {
            alert('Định dạng nhập vào không đúng');
            return null;
          }
        }
        if (method === '1') {
          this.setState({ cookieList: content });
        } else {
          this.setState({ cookieList: this.state.cookieList.concat(content) });
        }
      }
    }
    return null;
  }

  normalizeText(text) {
    return text.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  postMessage(thread, currentView, sessHash, passHash, idHash) {
    let message = null;
    let subject = '';
    if (currentView === 'thread') {
      message = document.querySelector('#vB_Editor_QR_textarea').value;
    } else {
      message = document.querySelector('#vB_Editor_001_textarea').value;
    }
    if (message.length < 10) {
      alert('Post quá ngắn, vui lòng thử lại');
      return null;
    }
    if (currentView === 'new-thread' || currentView === 'new-reply') {
      subject = document.querySelector('.panel .bginput').value;
    }
    if (subject.length < 1 && currentView === 'new-thread') {
      alert('Bạn chưa nhập tiêu đề');
      return null;
    }
    document.getElementById('voz-living-loader-wrapper').className = 'loading';
    chrome.runtime.sendMessage({ service: 'post-message', request: { message, thread, currentView, sessHash, passHash, idHash, subject } }, res => {
      if (res.resolve === 'post-reply') {
        if (res.url) {
          window.location.href = res.url;
        } else {
          window.location.href = `https://forums.voz.vn/showthread.php?t=${thread}`;
        }
      } else if (res.resolve === 'new-thread') {
        window.location.href = res.url;
      }
    });
    return null;
  }

  render() {
    const { isOpen, cookieList } = this.state;
    const uDir = document.querySelector('.tborder .alt2 > .smallfont > strong > a');
    let uName = null;
    if (uDir !== null) {
      uName = this.normalizeText(uDir.textContent);
    }
    // console.log([cookieList, isOpen, uName, currentView]);
    if (!isOpen) {
      cookieList.map(arr => { arr.icon = 'fa-question-circle'; return arr; });
      setChromeLocalStore({ cookieList });
    }
    return (
      <div className={'btn-group'}>
        <a
          className={`btn tooltip-right${isOpen ? ' active' : ''}`}
          href="#"
          style={{ fontSize: '20px' }}
          data-tooltip="Banyan x Space"
          onClick={(e) => {
            e.preventDefault();
            this.setState({ isOpen: !this.state.isOpen });
          }}
        ><i className="fa fa-users" /></a>
        {isOpen &&
        [
          <div
            key="multi-acc-mask"
            style={{ display: 'block' }}
            className="voz-mask multi-acc-mask"
            onClick={() => this.setState({ isOpen: !this.state.isOpen })}
          />,
          <div key="multi-acc-options" className="btn-options" style={{ display: 'flex', height: '450px', width: '565px', overflow: 'auto' }}>
            <h3>Đa tài khoản</h3>
            <table className="multi-acc-table">
              <thead>
              <tr>
                <th style={{ width: '175px' }}>Username</th>
                <th style={{ width: '175px' }}>Password</th>
                <th style={{ width: '160px' }}>Action</th>
                <th />
              </tr>
              </thead>
              <tbody id="multi-acc-body">
              {cookieList.map((cookie, i) => (
                <tr key={Math.random()}>
                  <td>
                    <input
                      defaultValue={cookie.username}
                      maxLength="25"
                      onChange={event => { this.handleChange(event, i, 'username'); }}
                    />
                  </td>
                  <td>
                    <input
                      disabled={cookieList[i].password === null}
                      type="password" defaultValue="vozliving" onFocus={e => {
                        if (e.target.value === 'vozliving') { e.target.value = ''; }
                      }} onBlur={e => {
                        if (e.target.value === '') { e.target.value = 'vozliving'; }
                      }}
                      onChange={event => { this.handleChange(event, i, 'password'); }}
                    />
                  </td>
                  <td>
                    <button
                      style={{ width: '54px' }}
                      onClick={() => { this.verifyAccount(cookieList[i].username, cookieList[i].password, i); }}
                      disabled={cookieList[i].password === null}
                    >
                      {!cookieList[i].verified ? '\u00A0Verify\u00A0' : 'Check'}</button>
                    {cookieList[i].verified && <button
                      disabled={uName === this.normalizeText(cookieList[i].username)}
                      onClick={() => {
                        this.changeAccount(cookieList[i].sessHash, cookieList[i].passHash, cookieList[i].idHash);
                      }}
                    >Default</button>
                    }
                    <button onClick={() => { this.removeAccount(i); }}><i className="fa fa-times" aria-hidden="true" /></button>
                  </td>
                  <td><i className={`fa fa-lg ${cookieList[i].icon}`} aria-hidden="true" /></td>
                </tr>
              ))}
              </tbody>
            </table>
            <div>
              <button style={{ marginRight: '3px' }} onClick={() => { this.addNewAccount(); }}>Add new account</button>
              <button style={{ marginRight: '3px' }} onClick={() => { this.importAccount(); }}>Import</button>
              <button style={{ marginRight: '3px' }} onClick={() => { this.exportAccount(); }}>Export</button>
              {!document.getElementsByClassName('thead').length &&
              <button
                onClick={() => {
                  location.href = 'https://forums.voz.vn/login.php?do=logout';
                }}
              >
                Logout banned account
              </button>}
            </div>
            <div id="vl-require-pass-wrapper" style={{ paddingTop: '10px' }} >
              <a
                id="vl-require-export-pass"
                onClick={() => { this.modifyPassword(); }}
                style={{ fontSize: '11px', float: 'right' }}
                title="Yêu cầu nhập mật khẩu trước khi export"
              >Require export password...</a>
              <button
                id="vl-add-pass"
                style={{ display: 'none', float: 'right' }}
                onClick={() => { this.addExportPassword(); }}
              >Add new password</button>
              <button
                id="vl-remove-pass"
                style={{ display: 'none', float: 'right' }}
                onClick={() => { this.removeExportPassword(); }}
              >Remove password</button>
            </div>
          </div>,
        ]}
      </div>
    );
  }

}
const mapStateToProps = state => {
  const { cookieList, exportPass } = state.vozLiving;
  return { cookieList, exportPass };
};

export default connect(mapStateToProps)(MultiAccounts);
