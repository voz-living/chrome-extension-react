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
    let ytb = href.match(/youtube\.com[^\s]+v=([a-zA-Z0-9_-]+)/i);
    let vne = /video\.vnexpress\.net\/parser/.test(href);
    let mp4 = href.match(/.*\.mp4$/i);
    if (ytb === null || ytb.length === 0) {
      ytb = href.match(/youtu\.be\/([a-zA-Z0-9_-]+)/i);
    }
    if (ytb !== null && ytb.length > 0) {
      $this.attr('data-smartlink', 'youtube');
      let ytbtime = href.match(/(?:youtu.be|youtube.com).*?t=(?:(\d*)h)*(?:(\d*)m)*(?:(\d*)s)*/i);
      if (ytbtime !== null && ytb.length > 0) {
        ytbtime[1] = ytbtime[1] || 0;
        ytbtime[2] = ytbtime[2] || 0;
        ytbtime[3] = ytbtime[3] || 0;
        ytbtime = Number(ytbtime[1]) * 3600 + Number(ytbtime[2]) * 60 + Number(ytbtime[3]);
        const $img = $(`<div><iframe width='560' height='315' src='https://www.youtube.com/embed/${ytb[1]}?start=${ytbtime}&amp;?rel=0'
							frameborder='0' allowfullscreen
            				title='Có thể xảy ra sai sót trong việc tự động nhận biết youtube, nếu có xin vui lòng báo lỗi qua pm greans(@vozforum)'>
        					</iframe>
						</div>`);
        $this.after($img);
      } else {
        const $img = $(`<div><iframe width='560' height='315' src='https://www.youtube.com/embed/${ytb[1]}?rel=0'
            					frameborder='0' allowfullscreen
            					title='Có thể xảy ra sai sót trong việc tự động nhận biết youtube, nếu có xin vui lòng báo lỗi qua pm greans(@vozforum)'>
        					</iframe>
					</div>`);
        $this.after($img);
      }
    } else if (vne === true) {
      $this.attr('data-smartlink', 'vnexpress-video');
      const uHref = 'https://' + href.replace(/http:\/\//, '');
      const $img = $(`<div><iframe width='480' height='270' src='${uHref}'
            					frameborder='0' allowfullscreen
            					title='Có thể xảy ra sai sót trong việc tự động nhận biết youtube, nếu có xin vui lòng báo lỗi qua pm greans(@vozforum)'>
        					</iframe>
					</div>`);
      $this.after($img);
    } else if (mp4 !== null && mp4.length > 0) {
      $this.attr('data-smartlink', 'mp4-video');
      const $img = $(`<div><video src='${href}' width='560' preload='metadata' controls></video></div>`);
      $this.after($img);
    }
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
