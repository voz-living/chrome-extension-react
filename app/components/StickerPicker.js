import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import $ from 'jquery';
import { getChromeSyncStore, setChromeSyncStore, getChromeLocalStore, setChromeLocalStore } from '../utils/settings';

const candy = '11f712f3240e20c';
const STICKER_CONFIG_KEY = 'stickerConfig';

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
    const { stickers, selectedSticker, isAdding } = this.state;
    let selected = stickers.find(s => s.key === selectedSticker);
    if (!selected) selected = stickers[0];
    return (
      <div className="sticker-box-wrapper">
        <div className="sticker-box">
          {stickers.length > 0
            ? <div>
            {selected.list.map(sticker => (
              <img className="sticker" alt={sticker.url} onClick={() => this.choseSticker(sticker)} src={sticker.url} />
            ))}
            </div>
            : <span>Bạn chưa có bộ sticker nào, Thêm vào hoặc <a href="https://vozforums.com/showpost.php?p=123774893&postcount=1555" target="_blank">vào đây</a> để xem 1 số bộ stickers</span>}
        </div>
        <ul className="sticker-set-list">
          {isAdding
            ? <li><i className="fa fa-spinner fa-spin"></i></li>
            : <li onClick={() => this.addStickerSet()}>+</li>}
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
              >x</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
