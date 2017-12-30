import React, { Component } from 'react';

export default class MultiAccounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }
  render() {
    const { isOpen } = this.state;
    return (
      <div className={'btn-group'}>
        <a
          className={'btn tooltip-right' + (isOpen ? ' active' : '')}
          href="#"
          style={{ fontSize: '20px' }}
          data-tooltip="Banyan x Space"
          onClick={(e) => { e.preventDefault(); this.setState({ isOpen: !this.state.isOpen }); }}
        ><i className="fa fa-users" /></a>
        <div
          key="voz-mask-quote-list"
          style={{ display: isOpen ? 'block' : 'none' }}
          className="voz-mask quote-list-mask"
          onClick={() => this.setState({ isOpen: !this.state.isOpen })}
        />
        <div className="btn-options" style={{ display: isOpen ? 'flex' : 'none', height: '350px', minHeight: '350px' }}>
          <h3>Đa tài khoản</h3>
          <table className="quick-link-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Password</th>
                <th style={{ width: '130px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input />
                </td>
                <td>
                  <input />
                </td>
                <td>
                  <button>Verify</button>
                  <button>Refresh</button>
                  <button>Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
          <button>Add new account</button>
        </div>
      </div>
    );
  }

}
