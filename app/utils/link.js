import $ from 'jquery';
import _ from 'lodash';

/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
export function replaceTextWithLink(node) {
  if (/(?=[^ ])(h *t *t *p *: *\/ *\/ *)?(([a-zA-Z0-9-\.]+\.)?[a-zA-Z0-9-]{3,}\.(com|net|org|us|info|vn|com\.vn|net\.vn|gov\.vn|edu|edu\.vn)(\/)?([^\s\[]+)?)(?=\s|$|\[)/.test($(node).text())) {
    const replacement = $(node).text().replace(/(?=[^ ])(h *t *t *p *: *\/ *\/ *)?(([a-zA-Z0-9-\.]+\.)?[a-zA-Z0-9-]{3,}\.(com|net|org|us|info|vn|com\.vn|net\.vn|gov\.vn|edu|edu\.vn)(\/)?([^\s\[]+)?)(?=\s|$|\[)/gi, "<a data-type='linkdetected' href='http://$2' target='_blank'>$2</a>");
    $(node).before(replacement);
    node.nodeValue = '';
  }
}

export function replaceLinks($html, isThreadContentOnly) {
  if (!isThreadContentOnly) {
    $html = $html.find("[id^='post_message_']");
  } else {
    const isReplace = $html.find('a[data-type="linkdetected"]');
    if (isReplace && isReplace.length > 0) return;
  }

  $html.each(function f() {
    const $this = $(this);
    const nodes = $this.contents();
    const subnodes = $this.find('*:not(a)').contents().filter(() => this.nodeType === 3);

    _.each(nodes, (node) => {
      if (node.nodeType === 3) replaceTextWithLink(node);
    });

    _.each(subnodes, (snode) => {
      if (snode.parentNode.nodeName.toLowerCase() !== 'a') replaceTextWithLink(snode);
    });
  });
}

export function removeRedirect($html) {
  $html.find("a[href*='redirect/index.php']").each(function f() {
    const $this = $(this);
    const url = $this.attr('href').match(/\?link=(.*)/)[1];
    const decoded = decodeURIComponent(url);
    $this.attr('href', decoded);
  });
}

export function resolveImage($html, isThreadContentOnly) {
  let $context = null;

  if (isThreadContentOnly) {
    $context = $html.find('a');
    const isReplace = $html.find('a[data-smartlink="image"]');
    if (isReplace && isReplace.length > 0) return;
  } else {
    $context = $html.find("[id^='post_message_'] a");
  }

  $context.each(function f() {
    const $this = $(this);
    const href = $this.attr('href');
    if ($this.find('img').length > 0) return;
    if (/\.(jpg|png|gif|bmp|jpeg)$/.test(href)) {
      $this.attr('data-smartlink', 'image');
      const $img = $(`<div>
            	<img src='${href}'
            		title='Tự động nhận diện link hình với voz living'/>
        		</div>`);
      $this.after($img);
    }
  });
  $(window).on('load', () => {
    $('.voz-post-message img[src^="http"]').each(function () {
      const $this = $(this);
      if ($this.height() <= 200) {
        $this.attr('class', 'inlineimg');
      }
    });
  });
}

export function resolveYoutube($html, isThreadContentOnly) {
  let $context;
  let frameCount = null;
  let fbPosts = null;
  if (isThreadContentOnly) {
    $context = $html.find('a');
    const isReplace = $html.find('a[data-smartlink="youtube"]');
    if (isReplace && isReplace.length > 0) return;
  } else {
    $context = $html.find("[id^='post_message_'] a");
  }
  $context.each(function () {
    const match = $(this).attr('href').match(/youtube\.com[^\s]+v=[a-zA-Z0-9_-]+|facebook.com.*\/videos\/.*|facebook.com.*\/posts\/.*|openload\.(?:co|link|io)\/f\/[\w-]*|soundcloud.com|.*\.mp4$/i);
    if ($(this).attr('href').match(/facebook\.com.*\/posts\/.*/i)) {
      fbPosts = true;
    }
    if (match !== null && match.length > 0) {
      frameCount += 1;
    }
  });
  if (fbPosts) {
    $('body').prepend('<script> window.fbAsyncInit = function() { FB.init({ xfbml : true, version : \'v2.10\' }); }; (function(d, s, id){ var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) {return;} js = d.createElement(s); js.id = id; js.src = "//connect.facebook.net/en_US/sdk.js"; fjs.parentNode.insertBefore(js, fjs); }(document, \'script\', \'facebook-jssdk\')); </script>');
  }
  $context.each(function f() {
    const $this = $(this);
    const href = $this.attr('href');
    if (/imgur\.com\/a\//.test(href)) {
      const node = $this[0];
      if (!(node.previousSibling && node.previousSibling.nodeName === '#text')) return;
      const match = node.previousSibling.textContent.trim().match(/Sticker (.*)/);
      if (match === null) return;
      const name = match[1];
      const btn = document.createElement('button');
      btn.textContent = 'Add Sticker';
      btn.addEventListener('click', (e) => {
        if (window.__addStickerSet) {
          window.__addStickerSet(href, name);
          btn.setAttribute('disabled', 'true');
        }
        e.preventDefault();
        return false;
      });
      $this.after(btn);
      $this.after('<span>&nbsp;</span>');
      return;
    }
    let $img = null;
    let ytb = href.match(/youtube\.com[^\s]+v=([a-zA-Z0-9_-]+)/i);
    const fbPost = href.match(/facebook\.com.*\/posts\/.*/i);
    const fbVideo = href.match(/facebook\.com.*\/videos\/.*/i);
    const openload = href.match(/openload\.(?:co|link|io)\/f\/([\w-]*)/i);
    const soundcloud = href.match(/soundcloud.com/i);
    const mp4 = href.match(/.*\.mp4$/i);
    // console.log(href, mp4);
    if (ytb === null || ytb.length === 0) { // 2nd try
      ytb = href.match(/youtu\.be\/([a-zA-Z0-9_-]+)/i);
    }
    if (ytb !== null && ytb.length > 0) {
      $this.attr('data-smartlink', 'youtube');
      let src = `https://www.youtube.com/embed/${ytb[1]}?rel=0`;
      let timeMatch = href.match(/t=([^&]*)[&$]?/i);
      // console.log('timeMatch', href, timeMatch)
      if (timeMatch !== null && timeMatch.length > 1) {
        let time = ~~timeMatch[1];
        if (time === 0) time = timeMatch[1] // eslint-disable-line curly
          .replace(/([hms])(?=\d)/g, '$1 ')
          .split(' ')
          .reduce((a, s) => a + ({ h: 3600, m: 60, s: 1 })[s.slice(-1)] * ~~s.slice(0, -1), 0);
        src += `&start=${time}`;
      }
      $img = $(`<div><iframe width='560' height='315'  src='${src}'
            					frameborder='0' allowfullscreen
            					title='Có thể xảy ra sai sót trong việc tự động nhận biết youtube, nếu có xin vui lòng báo lỗi qua pm greans(@vozforum)'>
        					</iframe>
					</div>`);
    } else if (/video\.vnexpress\.net\/parser/.test(href) === true) {
      $this.attr('data-smartlink', 'vnexpress-video');
      const uHref = 'https://' + href.replace(/http:\/\//, '');
      $img = $(`<div><iframe width='480' height='270' src='${uHref}'
            					frameborder='0' allowfullscreen
            					title='Có thể xảy ra sai sót trong việc tự động nhận biết video Vnexpress, nếu có xin vui lòng báo lỗi qua pm greans(@vozforum)'>
        					</iframe>
          </div>`);
    // } else if (/video\.vnexpress\.net/.test(href) === true) {
    //   $this.attr('data-smartlink', 'vnexpress-video');
    //   const uHref = 'https://' + href.replace(/http:\/\//, '') + '#wrapper_container';
    //   $img = $(`<div><iframe width='600' height='340' src='${uHref}'
    //         					frameborder='0' allowfullscreen
    //         					title='Có thể xảy ra sai sót trong việc tự động nhận biết video Vnexpress, nếu có xin vui lòng báo lỗi qua pm greans(@vozforum)'>
    //     					</iframe>
    //       </div>`);
    } else if (href.match(/facebook.com.*/i)) {
      if (fbVideo) {
        $this.attr('data-smartlink', 'fb-video');
        $img = $(`<div><iframe src="https://www.facebook.com/plugins/video.php?href=${href}&show_text=0&height=280"
							width="560" height="315" style="border:none;overflow:hidden" scrolling="no"
							frameborder="0" allowTransparency="true" allowFullScreen="true">
						 </iframe>
					</div>`);
      } else if (fbPost) {
        $this.attr('data-smartlink', 'fb-post');
        $img = $(`<br/><div class="fb-post" data-href="${href}" data-width="300"></div>`);
      }
    } else if (openload !== null && openload.length > 0) {
      $this.attr('data-smartlink', 'ol-video');
      $img = $(`<div><iframe src="https://openload.co/embed/${openload[1]}/" 
                             scrolling="no" frameborder="0" width="560" height="315"
                             allowfullscreen="true" ></iframe>
				<div style="font-size: 10px; color: #aaa">(Nên dùng thêm <a style="color: #999" href ="https://chrome.google.com/webstore/detail/openload-video-only/leallakffbiflfgpmamdgcojddnbfdgo" target="_blank">extension để chặn ad của openload</a>)</div></div>`);
    } else if (soundcloud !== null && soundcloud.length > 0) {
      $this.attr('data-smartlink', 'sc-video');
      $img = $(`<div><iframe width="560" height="315" scrolling="no" frameborder="no"
                             src="https://w.soundcloud.com/player/?url=${href}&amp;color=%23ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true">
                     </iframe>
                </div>`);
    } else if (mp4 !== null && mp4.length > 0) {
      $this.attr('data-smartlink', 'mp4-video');
      $img = $(`<div><video src='${href}' width='560' height='315' preload='metadata' controls></video></div>`);
    }
    if ($img !== null) {
      if (frameCount <= 15) {
        $this.after($img);
      } else {
        const button = $('<span>&nbsp;</span><button>Hiện Player</button>');
        button.click(() => {
          $this.after($img);
          button.remove();
        });
        $this.after(button);
      }
    }
  });
}

export function imageControl($html) {
  $(window).on('load', () => {
    $html.find('.voz-post-message img[src^="http"]').each(function a() {
      const $this = $(this);
      let deg = null;
      let fullsize = null;
      let collapse = null;
      let scale = 1;
      let transform = null;
      if ($this.width() > 200 && $this.height() > 200) {
        $this.wrap('<div class="img-wrapper"></div>');
        const url = $this.attr('src');
        $this.before('<div class="img-controls"></div>');
        const control = $this.siblings();
        control.append('<button>Hiện controller</button>');
        control.css({ opacity: 0 });
        $this.parent().hover(() => {
          control.css({ opacity: 1 });
        }, () => {
          control.css({ opacity: 0 });
        });
        function controls() {
          control.append(`<a href="#" data-tooltip="Xoay trái"><i class="fa fa-undo fa-lg control-button" id="rotate-left" ></i></a>
                      <a href="#" data-tooltip="Xoay phải"><i class="fa fa-repeat fa-lg control-button" id="rotate-right" ></i></a>
                      <a href="#" data-tooltip="Lật ngược"><i class="fa fa-exchange fa-lg control-button" id="flip-h" ></i></a>
                      <a href="https://images.google.com/searchbyimage?image_url=${url}" target="_blank" data-tooltip="Tìm qua Google Image"><i class="fa fa-search fa-lg control-button" id="google-search" ></i></a>
                      <a href="${url}" data-tooltip="Lưu hình ảnh" download><i class="fa fa-download fa-lg control-button" id="save-image"></i></a>`);
          control.find('.control-button#flip-h').on('click', () => {
            scale = -scale;
            console.log(scale);
            $this.css({ transform: `${transform} scaleX(${scale})` });
          });
          control.find('.control-button[id^="rotate"]').on('click', () => {
            deg += $(this).attr('id') === 'rotate-left' ? -90 : 90;
            if (deg / 90 % 2 === 1) {
              const translate = ($this.width() - $this.height()) / 2;
              $this.parent().css({ height: $this.width() });
              if (deg / 90 % 4 === 1) {
                transform = `rotate(${deg}deg) translate(${translate}px, ${translate}px)`
                $this.css({ transform: `${transform} scaleX(${scale})` });
              } else if (deg / 90 % 4 === 3) {
                transform = `rotate(${deg}deg) translate(${-translate}px, ${-translate}px)`
                $this.css({ transform: `${transform} scaleX(${scale})` });
              }
            } else {
              $this.parent().css({ height: '' });
              transform = `rotate(${deg}deg)`
              $this.css({ transform: `${transform} scaleX(${scale})` });
            }
          });
          if (url.match(/scontent.+?fbcdn.net.+/)) {
            const sp = url.split('/');
            const id = sp[sp.length - 1].split('_');
            control.append(`&nbsp;<a href="https://www.facebook.com/${id[1]}" target="_blank" data-tooltip="Tìm kiếm Facebook"><i class="fa fa-facebook-square fa-lg control-button" id="fb-resolve" ></i></a>`);
          }
          if ($this.prop('naturalHeight') - 2 > $this.height() && $this.prop('naturalWidth') - 2 > $this.width()) {
            control.append('&nbsp;<a href="#"  data-tooltip="Phóng to"><i class="fa fa-expand fa-lg control-button" id="expand"></i></a>');
            control.find('.control-button#expand').on('click', () => {
              const table = $this.closest('table.voz-postbit');
              fullsize = $this.css('max-width') === '100%' ? 'initial' : '100%';
              collapse = table.css('table-layout') === 'fixed' ? 'initial' : 'fixed';
              $this.css({ 'max-width': fullsize });
              table.css({ 'table-layout': collapse });
            });
          }
          control.children('a').on('click', function(e) {
            e.preventDefault();
            $(this).blur();
          });
        }
        control.children('button').on('click', () => {
          control.empty();
          controls();
        });
      }
    });
  });
}

/* eslint-enable no-param-reassign */
/* eslint-enable max-len */

export function proccessLink($html, isThreadContentOnly = false) {
  replaceLinks($html, isThreadContentOnly);
  removeRedirect($html);
  resolveImage($html, isThreadContentOnly);
  resolveYoutube($html, isThreadContentOnly);
  imageControl($html);
  return $html;
}
