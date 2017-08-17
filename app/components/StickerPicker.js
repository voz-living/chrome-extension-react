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
