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
      selectedSticker: 0,
    };
  }

  componentDidMount() {
    require('../styles/sticker-box.less');
    this.prepareStickerData()
      .then(stickers => {
        this.setState({ stickers });
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
      if (lastUpdate === null || (new Date().getTime() - parseInt(lastUpdate, 10) > 1000 * 60 * 60)) {
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
    const stickerManifestUrl = stickerUrl + '/declare.json';
    return PROXY_GET(stickerManifestUrl, { credentials: 'no-cors' })
      .then(res => {
        if (typeof res === 'string') res = JSON.parse(res);
        return Promise.all(Object.keys(res).map(k => {
          const sticker = res[k];
          sticker.key = k;
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

  render() {
    const { stickers } = this.state;
    const selected = stickers[this.state.selectedSticker];
    return (
      <div className="sticker-box">
        {stickers.length > 0
          ? <div>
          {selected.list.map(sticker => (
            <img className="sticker" alt={sticker.url} onClick={() => this.choseSticker(sticker)} src={sticker.url} />
          ))}
          </div>
          : <span>Loading</span>}
      </div>
    );
  }
}
