/* eslint-disable max-len */
import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { setChromeLocalStore } from '../utils/settings';
import { autobind } from 'core-decorators';


@autobind
class MultiAccounts extends Component {
  static propTypes = {
    cookieList: PropTypes.array,
    currentView: PropTypes.string,
  };

  static defaultProps = {
    cookieList: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      cookieList: this.props.cookieList,
    };
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

  normalizeText(text) {
    return text.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  postMessage(thread, currentView, sessHash, passHash, idHash) {
    let message = null;
    if (currentView === 'thread') {
      message = document.querySelector('#vB_Editor_QR_textarea').value;
    } else {
      message = document.querySelector('#vB_Editor_001_textarea').value;
    }
    if (message.length < 10) {
      alert('Post quá ngắn, vui lòng thử lại');
      return null;
    }
    chrome.runtime.sendMessage({ service: 'post-message', request: { message, thread, currentView, sessHash, passHash, idHash } }, res => {
      if (res.resolve === 'new-thread') {
        window.location.href = `https://vozforums.com/forumdisplay.php?f=${thread}`;
      } else {
        window.location.href = `https://vozforums.com/showthread.php?t=${thread}`;
      }
    });
    return null;
  }

  render() {
    const { isOpen, cookieList } = this.state;
    const { currentView } = this.props;
    const uDir = document.querySelector('.tborder .alt2 > .smallfont > strong > a');
    let uName = '';
    if (uDir !== null) {
      uName = this.normalizeText(uDir.textContent);
    }
    if (uDir !== null && (currentView === 'thread' || currentView === 'new-thread' || currentView === 'new-reply')) {
      let postButton;
      let thread;
      if (currentView === 'new-reply') {
        thread = window.location.href.match(/do=postreply&t=(\d+)/i)[1];
      } else if (currentView === 'new-thread') {
        thread = window.location.href.match(/do=newthread&f=(\d+)/i)[1];
      }
      if (currentView === 'thread') {
        thread = window.location.href.match(/showthread\.php\?t=(\d+)/i)[1];
        postButton = document.querySelector('.button#qr_submit');
      } else {
        postButton = document.querySelector('.button#vB_Editor_001_save');
      }
      postButton.style.display = 'none';
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
            style={{ font: '11px verdana' }}
            onClick={e => {
              const elem = document.querySelector('#vl-account-menu select');
              const value = elem.options[elem.selectedIndex].value;
              if (value !== 'default') {
                e.preventDefault();
                this.postMessage(thread, currentView, cookieList[value].sessHash, cookieList[value].passHash, cookieList[value].idHash);
              }
            }}
          >Post Quick Reply</button>
        </span>
      , document.getElementById('vl-account-menu'));
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
            <div key="multi-acc-options" className="btn-options" style={{ display: 'flex', height: '450px', minHeight: '450px', width: '545px' }}>
              <h3>Đa tài khoản</h3>
              <table className="multi-acc-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Password</th>
                    <th style={{ width: '160px' }}>Action</th>
                    <th />
                  </tr>
                </thead>
                <tbody id="multi-acc-body">
                {cookieList.map((cookie, i) => (
                  <tr key={Math.random()}>
                    <td>
                      <input defaultValue={cookie.username} maxLength="24" onChange={event => { this.handleChange(event, i, 'username'); }} />
                    </td>
                    <td>
                      <input
                        type="password" defaultValue="vozliving" onFocus={e => {
                          if (e.target.value === 'vozliving') { e.target.value = ''; }
                        }}
                        onChange={event => { this.handleChange(event, i, 'password'); }}
                      />
                    </td>
                    <td>
                      <button style={{ width: '54px' }} onClick={() => { this.verifyAccount(cookieList[i].username, cookieList[i].password, i); }}>
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
              <button onClick={() => { this.addNewAccount(); }}>Add new account</button>
            </div>,
          ]}
      </div>
    );
  }

}
const mapStateToProps = state => {
  const { cookieList } = state.vozLiving;
  return { cookieList };
};

export default connect(mapStateToProps)(MultiAccounts);
