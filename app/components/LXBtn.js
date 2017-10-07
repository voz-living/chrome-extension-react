import React, { Component } from 'react';

export default class LXBtn extends Component {
  constructor(prop) {
    super(prop);
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
          data-tooltip="Linh Xinh"
          onClick={() => { this.setState({ isOpen: !this.state.isOpen }); return false; }}
        >LX</a>
        <div
          key="voz-mask-quote-list"
          style={{ display: isOpen ? 'block' : 'none' }}
          className="voz-mask quote-list-mask"
          onClick={() => this.setState({ isOpen: !this.state.isOpen })}
        ></div>
        <div className="btn-options" style={{ display: isOpen ? 'block' : 'none', padding: 0 }}>
          <iframe src="https://voz-living.github.io/linhxinh/?extension=true" style={{ width: '100%', height: '100%' }}></iframe>
        </div>
      </div>
    );
  }
}