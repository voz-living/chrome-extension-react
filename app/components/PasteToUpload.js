import React, {
  Component,
  PropTypes,
} from 'react';
import $ from 'jquery';
import {
  uploadImage,
} from '../common/uploadImage';
import { copyText } from '../utils/clipboard';
import { toClassName } from '../utils';
import { insertTextIntoEditor } from '../common/editor';

function isInRichEditor(target) {
  do {
    if (target.tagName === 'DIV' && target.contentEditable === 'true' && target.classList.contains('editor')) {
      return target;
    }
    target = target.parentElement;
  } while(target !== null);
  return false;
}

// Adapt from https://github.com/JoelBesada/pasteboard-extension/blob/master/scripts/main.js
const CREDITS_TEXT = '[INDENT][SIZE="1"][COLOR="Navy"]Hình này được tự động upload và chèn link bởi [URL="https://chrome.google.com/webstore/detail/voz-living/bpfbcbgognjimbmabiiphhofpgdcgbgc"]Voz Living[/URL][/COLOR][/SIZE][/INDENT]';
class PasteToUpload extends Component {
  constructor(props) {
    super(props);
    this.bindPasteHandler();

    this.state = {
      status: null, /* processing, text, copied, cancel */
      text: '',
    };
  }

  bindPasteHandler() {
    document.addEventListener('paste', this.pasteHandler.bind(this));
  }

  pasteHandler(e) {
    // restrict handler to text area only
    const target = e.target;
    const isRichEditor = isInRichEditor(target);
    const isTextEditor = target.tagName.toUpperCase() === 'TEXTAREA';
    if (!(isTextEditor || isRichEditor)) return true;
    const items = e.clipboardData.items;

    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // We're only interested in images
        if (/image/.test(item.type)) {
          console.info('Image in clipboard detected');
          return this.insertImage(item.getAsFile(), $(target), { isRichEditor, isTextEditor });
        }
      }
    }
    return true;
  }

  insertImage(image, target, type) {
    let handleImageData = this.handleImageData;
    if (type.isRichEditor !== false) {
      handleImageData = this.handleImageDataRichEditor;
    }
    this.setState({ status: 'processing' });
    if (typeof image === 'string') {
      return setTimeout(handleImageData.bind(this, image, target, type), 1);
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(image);
    fileReader.onload = () => {
      handleImageData(fileReader.result, target, type);
    };
    return null;
  }

  handleImageData(imageData, target) {
    const position = insertTextIntoEditor('__Uploading ..__', target);
    target.prop('disabled', true);
    uploadImage(imageData).then(res => {
      if (res.url) {
        const text = `[img]${res.url}[/img]\n${CREDITS_TEXT}`;
        target.prop('disabled', false);
        insertTextIntoEditor(text, target, position);
        this.setState({ status: 'text', text });
      } else {
        target.prop('disabled', false);
        insertTextIntoEditor('', target, position);
        this.setState({ status: null });
        console.info('fail to upload image');
      }
    });
  }

  handleImageDataRichEditor(imageData, target, type) {
    // const position = insertTextIntoEditor('__Uploading ..__', target);
    const e = type.isRichEditor;
    e.setAttribute('contentEditable', false);
    uploadImage(imageData).then(res => {
      if (res.url) {
        const text = `[img]${res.url}[/img]\n${CREDITS_TEXT}`;
        e.setAttribute('contentEditable', true);
        document.execCommand('insertimage', false, res.url);
        this.setState({ status: 'text', text });
      } else {
        e.setAttribute('contentEditable', true);
        console.info('fail to upload image');
      }
    });
  }

  copy(text) {
    copyText(text);
    this.setState({ status: 'copied' });
    setTimeout(() => {
      this.setState({ status: null });
    }, 1100);
  }

  render() {
    if (true || this.state.status === null) {
      return null;
    } else {
      // const cls = {
      //   'voz-living-image-to-clipboard': true,
      //   'voz-living-image-to-clipboard-processing': this.state.status === 'processing',
      //   'voz-living-image-to-clipboard-text': this.state.status === 'text',
      //   'voz-living-image-to-clipboard-copied': this.state.status === 'copied',
      // };
      // return (
      //   <div className={toClassName(cls)}>
      //     {this.state.status === 'processing' ? (
      //       <span>Uploading ...</span>
      //     ) : null}
      //     {this.state.status === 'text' ? (
      //       <input
      //         id="voz-living-image-to-clipboard-textinput"
      //         type="text"
      //         data-tooltip="Click để copy"
      //         value={this.state.text}
      //         onFocus={this.copy.bind(this, this.state.text)}
      //       />
      //     ) : null}
      //     {this.state.status === 'copied' ? (
      //       <span>Copied</span>
      //     ) : null}
      //   </div>
      // );
    }
  }
}

export default PasteToUpload;
