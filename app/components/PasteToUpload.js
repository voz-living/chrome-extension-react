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
  } while (target !== null);
  return false;
}

// Adapt from https://github.com/JoelBesada/pasteboard-extension/blob/master/scripts/main.js
const CREDITS_TEXT = '[INDENT][SIZE="1"][COLOR="Navy"]Hình này được tự động upload và chèn link bởi [URL="https://chrome.google.com/webstore/detail/voz-living/bpfbcbgognjimbmabiiphhofpgdcgbgc"]Voz Living[/URL][/COLOR][/SIZE][/INDENT]';
class PasteToUpload extends Component {
  static propTypes = {
    currentView: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.bindPasteHandler();

    this.state = {
      status: null, /* processing, text, copied, cancel */
      text: '',
    };
  }

  openFile(event) {
    const input = event.target.files;
    const { currentView } = this.props;
    let target;
    let dataURL = [];
    if (currentView === 'thread') {
      target = $('#vB_Editor_QR_textarea');
    } else {
      target = $('#vB_Editor_001_textarea');
    }
    const obj = Object.entries(input);
    Object.entries(input).forEach((val, i) => {
      const reader = new FileReader();
      reader.onload = () => {
        dataURL.push(reader.result);
        if (i + 1 === obj.length) {
          if (obj.length === 1) dataURL = dataURL.join('');
          this.handleImageData(dataURL, target);
        }
      };
      if (!/image/i.test(val[1].type)) return;
      reader.readAsDataURL(val[1]);
    });
  }

  bindPasteHandler() {
    document.addEventListener('paste', this.pasteHandler.bind(this));
    const { currentView } = this.props;
    if (currentView === 'thread'
      || currentView === 'new-reply'
      || currentView === 'edit-reply'
      || currentView === 'new-thread') {
      $('.panelsurround a[href="http://pik.vn/"]').after('&nbsp;<input class="vl-insert-image" type="file" id="file" accept="image/*" multiple/><label id="vl-img-label" for="file">Chọn ảnh</label>');
      $('.vl-insert-image').change(event => this.openFile(event));
    }
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
    const $this = this;
    const position = insertTextIntoEditor('__Uploading ..__', target);
    target.prop('disabled', true);
    $('.vl-insert-image').prop('disabled', true);
    if (Array.isArray(imageData)) {
      let text = '';
      let i = 0;
      function uploadRecursively() {
        uploadImage(imageData[i]).then(res => {
          i++;
          if (!res.url) {
            text += '';
            console.info(`failed in ${i}th image`);
          } else {
            text += `[img]${res.url}[/img]\n${CREDITS_TEXT}\n`;
          }
          if (i + 1 >= imageData.length) {
            $('.vl-insert-image').prop('disabled', false);
            target.prop('disabled', false);
            insertTextIntoEditor(text, target, position);
            $this.setState({ status: 'text', text });
          } else {
            uploadRecursively();
          }
        });
      }
      uploadRecursively(i);
    } else {
      uploadImage(imageData).then(res => {
        $('.vl-insert-image').prop('disabled', false);
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
