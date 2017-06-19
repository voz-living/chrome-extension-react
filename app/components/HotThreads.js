import React, { Component } from 'react';
import { GET } from '../utils/http';

const apiUrl = 'https://voz-living.appspot.com/query?id=agxzfnZvei1saXZpbmdyFQsSCEFwaVF1ZXJ5GICAgICA5JEKDA&format=json';

export default class HotThreads extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      isOpen: false,
      threads: [],
    };
  }

  componentDidMount() {
    GET(apiUrl, { credentials: 'same-origin' })
      .then(response => {
        let stats = response;
        if (typeof response === 'string') {
          stats = JSON.parse(response);
        }
        this.updateFromAPI(stats);
      });
  }

  updateFromAPI(json) {
    if (json.rows) {
      const threads = json.rows.map(r => {
        const info = r[1];
        const count = parseInt(r[2], 10);
        const [threadId, threadTitle] = info.split(':|:');
        return {
          threadId,
          threadTitle,
          count,
        };
      });
      this.setState({ threads });
    }
  }
  render() {
    const { isOpen, threads } = this.state;
    return (
      <div className={'btn-group hot-threads'}>
        <a
          className={'btn tooltip-right' + (isOpen ? ' active' : '')}
          href="javascript:void(0)"
          style={{ fontSize: '20px' }}
          target="_blank"
          data-tooltip="Thớt hot"
          onClick={() => this.setState({ isOpen: !this.state.isOpen })}
        ><i className="fa fa-fire"></i></a>
        <div
          key="voz-mask-quote-list"
          style={{ display: isOpen ? 'block' : 'none' }}
          className="voz-mask quote-list-mask"
          onClick={() => this.setState({ isOpen: !this.state.isOpen })}
        ></div>
        <div className="btn-options" style={{ display: isOpen ? 'flex' : 'none' }}>
          <h3>Hot Threads (Thời gian thực)</h3>
          <div>
            <i>(Đang được xem trong 30 phút cho tới hiện tại)</i>
          </div>
          <div className="quote-list">
          {threads.map(({ threadId, threadTitle, count }) => (
            <div className="quote-row">
              <div className="quote-title">
                <a href={`showthread.php?t=${threadId}`} target="_blank">{threadTitle}</a>
              </div>
              <div className="quote-bottom">
                <i className="fa fa-arrow-right"></i> Có {count} người đang xem
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    );
  }
}