import {
  Component,
  PropTypes,
} from 'react';
import $ from 'jquery';
import html2canvas from 'html2canvas';
import { uploadImage } from '../common/uploadImage';
import { copyText } from '../utils/clipboard';

export default class CapturePost extends Component {

  constructor(props) {
    super(props);
    this.addScript();
    this.hookToPost();
  }

  addScript() {
    const scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js';
    document.body.appendChild(scriptTag);
  }

  hookToPost() {
    $('.voz-postbit td[id^=td_post_]').each((i, e) => {
      const $this = $(e);
      // const uid = $this.find("a[href*='member.php']").attr('href').match(/\?u=(\d+)/)[1];
      const $captureButton = $(`<div class="voz-living-capture-post">
      <a 
        href="javascript:void(0)"
        class="tooltip-left voz-living-capture"
        data-tooltip="Chụp bài viết"
      >
        <i class="fa fa-camera" />
      </a></div>`);
      $captureButton.find(' > a').on('click', this.capturePost.bind(this, $this, $captureButton));
      $this.find('> div:last').append($captureButton);
    });
  }

  capturePost($post, $btn) {
    $btn.find('.voz-living-capture-post-link').remove();
    $btn.find('.voz-living-capture-post-image').remove();
    try {
      const $txt = $('<input class="voz-living-capture-post-link" type="text" size=30 value="Chờ tí nhé" />');
      $btn.append($txt);
      setTimeout(() => {
        html2canvas($post[0])
        .then(canvas => canvas.toDataURL('image/png'))
        .then((imageData) => {
          $txt.val('Uploading to pik.vn');
          const $image = $(`<a href="${imageData}" target="_blank" class="voz-living-capture-post-image"><i class="fa fa-file-photo-o" /></a>`)
          $btn.append($image);
          $image.on('click', () => {
            setTimeout(() => $image.remove(), 500);
          });
          return uploadImage(imageData);
        })
        .then((res) => {
          const url = res.url;
          $txt.val(url);
          $txt.on('click', () => {
            copyText(url);
            $txt.val('Coppied');
            setTimeout(() => $txt.remove(), 1000);
          });
        })
        .catch((e) => {
          throw e;
        });
      }, 300);
    } catch (e) {
      alert('Có lỗi xảy ra, không thể chụp được bài viết này');
      console.error(e);
    }
  }

  render() {
    return null;
  }
}
