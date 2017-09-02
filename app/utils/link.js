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
  $('.voz-post-message img[src^="http"]').each(function () {
    const $this = $(this);
    if ($this.width() <= 200 && $this.height() <= 200) {
      $this.attr('class', 'inlineimg');
    }
  });
}

export function resolveYoutube($html, isThreadContentOnly) {
  let $context;

  if (isThreadContentOnly) {
    $context = $html.find('a');
    const isReplace = $html.find('a[data-smartlink="youtube"]');
    if (isReplace && isReplace.length > 0) return;
  } else {
    $context = $html.find("[id^='post_message_'] a");
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
    const fb = href.match(/facebook.com.*\/videos\/.*/i);
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
    } else if (fb !== null && fb.length > 0) {
      $img = $(`<div><iframe src="https://www.facebook.com/plugins/video.php?href=${fb}&show_text=0&height=280"
							width="560" height="315" style="border:none;overflow:hidden" scrolling="no"
							frameborder="0" allowTransparency="true" allowFullScreen="true">
						 </iframe>
					</div>`);
    } else if (mp4 !== null && mp4.length > 0) {
      $this.attr('data-smartlink', 'mp4-video');
      $img = $(`<div><video src='${href}' width='560' height='315' preload='metadata' controls></video></div>`);
    }
    if ($img !== null) $this.after($img);
  });
}

/* eslint-enable no-param-reassign */
/* eslint-enable max-len */

export function proccessLink($html, isThreadContentOnly = false) {
  replaceLinks($html, isThreadContentOnly);
  removeRedirect($html);
  resolveImage($html, isThreadContentOnly);
  resolveYoutube($html, isThreadContentOnly);
  return $html;
}
