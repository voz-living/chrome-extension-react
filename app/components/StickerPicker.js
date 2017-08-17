import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { PROXY_GET } from '../utils/http';

const stickerUrl = 'https://raw.githubusercontent.com/voz-living/chrome-extension-react/master/resource/sticker';

@autobind
export default class StickerPicker extends Component {
  static propTypes = {
    onStickerClick: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      stickers: [],
      selectedSticker: window.localStorage.getItem('vozLivingStickerSelected'),
    };
  }

  componentDidMount() {
    require('../styles/sticker-box.less');
    this.prepareStickerData()
      .then(stickers => {
        let { selectedSticker } = this.state;
        if (!stickers.find(s => s.key === selectedSticker)) selectedSticker = stickers[0].key;
        this.setState({ stickers, selectedSticker });
      });
  }

  prepareStickerData() {
    const storageData = window.localStorage.getItem('vozLivingStickerData');
    if (storageData === null) {
      return this.downloadStickerData()
        .then(data => {
          window.localStorage.setItem('vozLivingStickerData', JSON.stringify(data));
          window.localStorage.setItem('vozLivingStickerData_lastUpdate', new Date().getTime());
          return data;
        }).catch((e) => {
          console.log(e);
        });
    }
    const data = JSON.parse(storageData);
    setTimeout(() => {
      const lastUpdate = window.localStorage.getItem('vozLivingStickerData_lastUpdate');
      if (lastUpdate === null || (new Date().getTime() - parseInt(lastUpdate, 10) > 1000 * 60 * 5)) {
        this.downloadStickerData()
          .then(dlData => {
            const str = JSON.stringify(dlData);
            if (str === storageData) return;
            window.localStorage.setItem('vozLivingStickerData', str);
            window.localStorage.setItem('vozLivingStickerData_lastUpdate', new Date().getTime());
          }).catch(() => {});
      }
    }, 2000);
    return Promise.resolve(data);
  }

  downloadStickerData() {
    const stickerManifestUrl = `${stickerUrl}/declare.json?version=${chrome.runtime.getManifest().version}`;
    return PROXY_GET(stickerManifestUrl, { credentials: 'no-cors' })
      .then(res => {
        if (typeof res === 'string') res = JSON.parse(res);
        return Promise.all(Object.keys(res).map(k => {
          const sticker = res[k];
          sticker.key = k;
          if (typeof sticker.list === 'object') return sticker;
          const stickerListUrl = `${stickerUrl}/${k}/list`;
          return PROXY_GET(stickerListUrl, { credentials: 'no-cors' })
            .then(sList => sList.split(/\n/).sort().map(name => ({
              url: `${stickerUrl}/${k}/${name}`,
            }))).then(list => {
              sticker.list = list;
              return sticker;
            });
        }));
      });
  }

  choseSticker(sticker) {
    this.props.onStickerClick(sticker);
  }

  selectStickerSet(key) {
    this.setState({ selectedSticker: key });
    window.localStorage.setItem('vozLivingStickerSelected', key);
  }

  render() {
    const { stickers, selectedSticker } = this.state;
    const selected = stickers.find(s => s.key === selectedSticker);
    return (
      <div className="sticker-box-wrapper">
        <div className="sticker-box">
          {stickers.length > 0
            ? <div>
            {selected.list.map(sticker => (
              <img className="sticker" alt={sticker.url} onClick={() => this.choseSticker(sticker)} src={sticker.url} />
            ))}
            </div>
            : <span>Loading</span>}
        </div>
        {stickers.length > 0 &&
          <ul className="sticker-set-list">
            {stickers.map(sticker => (
              <li
                className={sticker.key === selectedSticker ? 'sticker-set-selected' : ''}
                onClick={() => this.selectStickerSet(sticker.key)}
              >{sticker.key === selectedSticker ? '▶' : <span>&nbsp;</span>} {sticker.title}&nbsp;</li>
            ))}
          </ul>
        }
      </div>
    );
  }
}
