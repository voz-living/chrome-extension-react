import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import $ from 'jquery';
import { getChromeSyncStore, setChromeSyncStore, getChromeLocalStore, setChromeLocalStore } from '../utils/settings';

const candy = '11f712f3240e20c';
const STICKER_CONFIG_KEY = 'stickerConfig';
const stickerSizeRef = {};
const getImageSize = (src) => (stickerSizeRef[src]
  ? Promise.resolve(stickerSizeRef[src])
  : new Promise((resolve) => {
    const newImg = new Image();
    newImg.onload = () => {
      const height = newImg.height;
      const width = newImg.width;
      stickerSizeRef[src] = { width, height };
      resolve(stickerSizeRef[src]);
    };
    newImg.src = src;
  }));

function loadStickers(id) {
  return new Promise((resolve) => {
    $.ajax({
      async: true,
      crossDomain: true,
      url: `https://api.imgur.com/3/album/${id}/images`,
      method: 'GET',
      headers: {
        Authorization: `Client-ID ${candy}`,
      },
    })
    .done((res) => {
      const images = res.data;
      resolve(images.map(img => ({
        url: img.link,
      })));
    });
  });
}

function getStickerSets() {
  return getChromeSyncStore([STICKER_CONFIG_KEY])
    .then(store => (store[STICKER_CONFIG_KEY] ? store[STICKER_CONFIG_KEY] : []));
}

@autobind
export default class StickerPicker extends Component {
  static propTypes = {
    onStickerClick: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      stickers: [],
      isAdding: false,
      selectedSticker: window.localStorage.getItem('vozLivingStickerSelected'),
      information: null,
    };
    this.getStickerConfig()
      .then(this.updateStateStickers);
  }

  componentDidMount() {
    require('../styles/sticker-box.less');
    window.__addStickerSet = this.addStickerSet.bind(this);
  }

  getStickerConfig() {
    return getStickerSets()
      .then((items) => {
        return Promise.all(items.map(({ key, title }) => {
          const k = `sticker_${key}`;
          return getChromeLocalStore([k])
            .then((lstore) => {
              if (lstore[k]) {
                return lstore[k];
              }
              return loadStickers(key);
            })
            .then((list) => {
              setChromeLocalStore({ [k]: list });
              return {
                key,
                title,
                list,
              };
            });
        }))
      });
  }

  updateStateStickers(stickers) {
    let { selectedSticker } = this.state;
    if (!stickers.find(s => s.key === selectedSticker) && stickers.length > 0) selectedSticker = stickers[0].key;
    this.setState({ stickers, selectedSticker });
  }

  choseSticker(sticker) {
    this.props.onStickerClick(sticker);
  }

  selectStickerSet(key) {
    this.setState({ selectedSticker: key });
    window.localStorage.setItem('vozLivingStickerSelected', key);
  }

  stickerOver(sticker, e) {
    const information = <div className="sticker-preview">
      <img src={sticker.url} />
      <div className="sticker-preview-label">Kích thước thật</div>
    </div>;
    this.setState({ information });
    // getImageSize(sticker.url)
    //   .then(({ width, height }) => {
    //     const information = <span>Size: {width} x {height} | {width} px: <div className="sticker-ruler" style={{ width }}></div></span>;
    //     this.setState({ information });
    //   });
  }

  containerOut() {
    this.setState({ information: null });
  }

  removeStickerSet(key) {
    try {
      const stickers = this.state.stickers.slice();
      const idx = stickers.findIndex(s => s.key === key);
      stickers.splice(idx, 1);
      this.updateStateStickers(stickers);
      setChromeSyncStore({ [STICKER_CONFIG_KEY]: stickers.map(sticker => ({
        key: sticker.key,
        title: sticker.title,
      })) });
      chrome.storage.local.remove(`sticker_${key}`);
    } catch (e) {
      alert('Không thể xoá, xin thử lại sau');
      console.log(e.stack);
    }
  }

  addStickerSet(url = null, suggestName = null) {
    if (url === null) {
      url = prompt('imgur album url:', 'http://imgur.com/a/');
    }
    if (url === null) return;
    if (/imgur\.com\/a\/.+/.test(url) === false) {
      return alert('Invalid album url');
    }
    const match = url.match(/a\/([^ ]*)/);
    if (match === null) return;
    const aId = match[1];

    let name;
    let validName = true;
    do {
      validName = true;
      name = prompt('tên của sticker set (<= 20 kí tự)', suggestName !== null ? suggestName : aId);
      if (name === null) return;
      if (name.trim() === '') {
        alert('Tên bị trống');
        validName = false;
      }
      if (name.length > 20) {
        alert('Tên quá dài');
        validName = false;
      }
    } while (!validName);

    this.setState({ isAdding: true });
    Promise.all([
      getStickerSets()
        .then((set) => {
          set.push({ key: aId, title: name });
          return setChromeSyncStore({ [STICKER_CONFIG_KEY]: set });
        }),
      loadStickers(aId),
    ])
    .then(([, list]) => {
      const k = 'sticker_' + aId;
      return setChromeLocalStore({ [k]: list });
    })
    .then(() => {
      alert(`Đã thêm '${name}'`);
      this.getStickerConfig()
        .then((stickers) => {
          this.updateStateStickers(stickers);
        });
      this.setState({ isAdding: false });
    });
  }

  render() {
    const { stickers, selectedSticker, isAdding, information } = this.state;
    let selected = stickers.find(s => s.key === selectedSticker);
    if (!selected) selected = stickers[0];
    const infoStyle = {
      opacity: 0,
      visibility: 'hidden',
    }
    if (information) Object.assign(infoStyle, { opacity: 0.8, visibility: 'visible' });
    return (
      <div className="sticker-box-wrapper">
        <div className="sticker-information" style={infoStyle}>
          {information}
        </div>
        <div
          className={'sticker-box' + (stickers.length === 0 ? ' empty-sticker' : '')}
          onMouseOut={this.containerOut}
        >
          {stickers.length > 0
            ? <div>
            {selected.list.map(sticker => (
              <img
                className="sticker"
                alt={sticker.url}
                onClick={() => this.choseSticker(sticker)} src={sticker.url}
                onMouseOver={this.stickerOver.bind(this, sticker)}
                // onMouseOver={this.stickerOver.bind(sticker)}
              />
            ))}
            </div>
            : <span>&nbsp;Bạn chưa có bộ sticker nào,&nbsp;
              {
                isAdding
                ? <span> chờ tí <i className="fa fa-spinner fa-spin"></i></span>
                : <a href="#" onClick={(e) => {
                  e.preventDefault();
                  this.addStickerSet();
                  return false;
                }}>Tự thêm vào</a>
              }
              &nbsp;hoặc <a href="https://vozforums.com/showpost.php?p=123774893&postcount=1555" target="_blank">vào đây để xem 1 số bộ stickers </a></span>}
        </div>
        <ul className="sticker-set-list">
          {stickers.length > 0 ?
           isAdding
              ? <li data-tooltip="Đang them"><i className="fa fa-spinner fa-spin"></i></li>
              : <li onClick={() => this.addStickerSet()} data-tooltip="Thêm sticker">+</li>
            : null
          }
          {stickers.map(sticker => (
            <li
              className={sticker.key === selectedSticker ? 'sticker-set-selected' : ''}
              onClick={() => this.selectStickerSet(sticker.key)}
            >
              {sticker.key === selectedSticker ? '▶' : <span>&nbsp;</span>}
              {sticker.title}&nbsp;
              <button onClick={(e) => {
                e.preventDefault();
                this.removeStickerSet(sticker.key);
                return false;
              }}
                data-tooltip="Xoá sticker"
              >x</button>
            </li>
          ))}
          <li>
            <a href="https://vozforums.com/showpost.php?p=123774893&postcount=1555" target="_blank" data-tooltip="Sticker List">ℹ</a>
          </li>
        </ul>
      </div>
    );
  }
}
