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
    // this.request();
  }

  request() {
    // chrome.runtime.sendMessage({ service: 'request-hotthreads' }, (data) => {
    //   this.updateFromAPI(data);
    //   setTimeout(this.request.bind(this), 1000 * 60 * 30);
    // });
  }

  updateFromAPI(rows) {
    if (rows && rows.length && rows.length > 0) {
      const threads = rows.map(r => {
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
          href="#"
          style={{ fontSize: '20px' }}
          data-tooltip="Thớt hot"
          onClick={(e) => { e.preventDefault(); this.setState({ isOpen: !this.state.isOpen }); }}
        ><i className="fa fa-fire"></i></a>
        <div
          key="voz-mask-quote-list"
          style={{ display: isOpen ? 'block' : 'none' }}
          className="voz-mask quote-list-mask"
          onClick={() => this.setState({ isOpen: !this.state.isOpen })}
        ></div>
        <div className="btn-options" style={{ display: isOpen ? 'flex' : 'none', height: '170px', minHeight: '170px' }}>
          <h3>Hot Threads (Thời gian thực)</h3>
          <div>
            <i>(Đang được xem trong 30 phút trước cho tới hiện tại)</i><br/>
            <p>Chức năng này đang được cân nhắc đóng tạm vì tốn kém chi phí duy trì cũng như lợi ích mang lại không thiết thực lắm.</p>
            <p>Nếu có ý kiến khắc xin mời góp ý ở dưới hoặc trong <a href="https://forums.voz.vn/showthread.php?t=2846050" target="_blank">thớt</a><br/></p>
            Xin lỗi nếu có gì bất tiện, message này sẽ được xoá trong 1 tháng tới.
          </div>
        </div>
      </div>
    );
  }
}