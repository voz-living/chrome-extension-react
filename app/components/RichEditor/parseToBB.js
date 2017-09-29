import emotions from '../../constants/emotions';

const emoMap = emotions.reduce((acc, { text, src }) => Object.assign(acc, { [src]: text }), {});

function rgb2hex(rgb){
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? '#' +
    ('0' + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ('0' + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ('0' + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function ensureProperColor(color) {
  if (/rgba?/.test(color)) return rgb2hex(color);
  return color;
}

function wrappingArround({ pre, post, tracker } ,pr, po) {
  const isPre = typeof pre !== 'undefined' && pre !== null;
  const isPost = typeof post !== 'undefined' && post !== null;
  if (isPre) {
    pre.unshift(pr);
  }
  if (isPost) {
    post.push(po);
  }
  if (isPre || isPost) {
    tracker.count++;
  }
}

export default function parseToBB(node, nextNode) {
  const bbcodes = [];
  const pre = [];
  const post = [];
  const tracker = {
    count: 0,
  };
  const pp = wrappingArround.bind(null, { pre, post, tracker });
  let processBasedOnStyle = true;
  if (typeof node.getAttribute === 'undefined'
    || !(node.getAttribute('contenteditable') === 'true'
      || node.getAttribute('contenteditable') === true)) {
    switch (node.nodeType) {
      case 1: { // tag
        switch (node.tagName.toUpperCase()) {
          case 'UL': { pp('[LIST]', '[/LIST]'); processBasedOnStyle = true; break; }
          case 'OL': { pp('[LIST=1]', '[/LIST]'); break; }
          case 'LI': { pp('[*]'); break; }
          case 'B': { pp('[B]', '[/B]'); break; }
          case 'U': { pp('[U]', '[/U]'); break; }
          case 'I': { pp('[I]', '[/I]'); break; }
          case 'STRIKE': { pp('[STRIKE]', '[/STRIKE]'); break; }
          case 'DIV': { pp(null, '\n'); break; }
          case 'P': { pp('\n', '\n'); break; }
          case 'BR': { pp('\n'); break; }
          case 'BLOCKQUOTE': { pp('[INDENT]', '[/INDENT]'); break; }
          case 'QUOTE': {
            const by = node.getAttribute('data-by');
            const bbcode = node.getAttribute('data-bbcode');
            if (by && bbcode) {
              return bbcode;
            } else {
              pp('[QUOTE]', '[/QUOTE]');
            }
            break;
          }
          case 'IMG': {
            const { src } = node;
            if (/:\/\/vozforums\.com\/images\//.test(src)) {
              const path = src.split(/:\/\/vozforums\.com/)[1];
              if (emoMap[path]) return emoMap[path];
            }
            return `[IMG]${src}[/IMG]`;
          }
          case 'FONT': {
            const { color } = node;
            if (color) {
              pp(`[COLOR="${ensureProperColor(color)}"]`, '[/COLOR]');
            }
            break;
          }
          case 'A': {
            const { href } = node;
            if (href && href.length > 0) {
              pp(`[URL=${href}]`, '[/URL]');
            }
            break;
          }

          case 'H1': { pp('[B][SIZE="7"]', '[/SIZE][/B]\n'); break; }
          case 'H2': { pp('[B][SIZE="6"]', '[/SIZE][/B]\n'); break; }
          case 'H3': { pp('[B][SIZE="5"]', '[/SIZE][/B]\n'); break; }
          case 'H4': { pp('[B][SIZE="4"]', '[/SIZE][/B]\n'); break; }
          case 'TABLE':
          case 'TR': {
            pp(null, '\n');
            break;
          }
          case 'IFRAME': {
            const { src } = node;
            if (/video/.test(src)) return `\n${src}\n`;
            return '';
          }
        }
        if (processBasedOnStyle === true) {
          const { textAlign, fontWeight, fontStyle, textDecoration, color } = node.style;
          switch (textAlign.toUpperCase()) {
            case 'LEFT': { pp('[LEFT]', '[/LEFT]'); break; }
            case 'RIGHT': { pp('[RIGHT]', '[/RIGHT]'); break; }
            case 'CENTER': { pp('[CENTER]', '[/CENTER]'); break; }
          }
          if (fontWeight === 'bold' || ~~fontWeight >= 600) {
            pp('[B]', '[/B]');
          }
          if (fontStyle === 'italic') pp('[I]', ['/I']);
          if (textDecoration === 'underline') pp('[U]', ['/U']);
          if (color && color.trim() !== '') pp(`[COLOR="${ensureProperColor(color)}"]`, '[/COLOR]');
        }
        break;
      }
      case 3: {
        if (nextNode && nextNode.tagName && ['DIV', 'P'].indexOf(nextNode.tagName.toUpperCase()) > -1) {
          return node.textContent + '\n';
        }
        return node.textContent;
      } // textNode
      case 8: return null; // comment
      default: return null;
    }
  } else {
    // node.childNodes.forEach(cnode => {
    //   if (cnode.nodeType === 3) {
    //     const text = cnode.textContent;
    //     const rnode = document.createElement('div');
    //     rnode.textContent = text;
    //     node.replaceChild(rnode, cnode);
    //   }
    // });
  }
  node.childNodes.forEach((cnode, i) => {
    const out = parseToBB(cnode, node.childNodes[i + 1]);
    if (out !== null) {
      bbcodes.push(out);
    }
  });
  return pre.concat(bbcodes).concat(post).join('');
}
