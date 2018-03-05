import {
  Component,
  PropTypes,
} from 'react';
import $ from 'jquery';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import { uploadImage } from '../common/uploadImage';
import { copyText } from '../utils/clipboard';

export default class CapturePost extends Component {

  constructor(props) {
    super(props);
    this.hookToPost();
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
      const $txt = $('<input class="voz-living-capture-post-link" size=30 value="Capturing by Voz Living" />');
      $btn.append($txt);
      setTimeout(() => {
        const post = $post.parents('table.voz-postbit')[0];
        let object;
        if ($(post).find('img[src^="http\:"]').length) {
          object = { useCORS: true, allowTaint: true };
        } else {
          object = { useCORS: true };
        }
        post.scrollIntoView();
        $(post).find('img[src^="http"]').attr({ crossOrigin: 'anonymous' });
        $('.img-controls, .btn-minimize-quote').css({ display: 'none' });
        $txt.val('Captured by Voz Living');
        html2canvas(post, object)
        .then(canvas => canvas.toDataURL('image/png'))
        .catch(() => alert('Có lỗi xảy ra, không thể chụp được bài viết'))
        .then((imageData) => {
          $txt.val('Uploading to destined source');
          post.scrollIntoView(false);
          scrollBy(0, 200);
          $('.img-controls, .btn-minimize-quote').css({ display: '' });
          return uploadImage(imageData);
        })
        .then((res) => {
          const url = res.url;
          if (_.isUndefined(url)) {
            $txt.val('Failed to upload');
          } else {
            $txt.val(url);
            open(url, '_blank');
          }
          $txt.on('click', () => {
            let to = 100;
            if (!_.isUndefined(url)) {
              copyText(url);
              $txt.val('Copied');
              to = 1000;
            }
            setTimeout(() => $txt.remove(), to);
          });
        })
        .catch((e) => {
          throw e;
        });
        return null;
      }, 100);
    } catch (e) {
      alert('Có lỗi xảy ra, không thể chụp được bài viết này');
      console.error(e);
    }
  }

  render() {
    return null;
  }
}
