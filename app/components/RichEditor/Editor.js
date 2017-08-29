import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { render } from 'react-dom';
import Command from './Command';
import CommandFormatBlock from './CommandFormatBlock';
import CommandColor from './CommandColor';
import CommandPrompt from './CommandPrompt';
// import { insertTextIntoEditor } from '../common/editor';
import emotions from '../../constants/emotions';
const emoMap = emotions.reduce((acc, { text, src }) => Object.assign(acc, { [src]: text }), {});
/** TODOs:
 * Handle image paste & update
 * Insert emo panels and handle insertion
 * Insert quotes
 * Handle Advanced editor page
 */
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

function wrappingArround({ pre, post} , pr, po) {
  if (typeof pre !== 'undefined' && pre !== null) pre.unshift(pr);
  if (typeof post !== 'undefined' && post !== null) post.push(po);
}

function parseToBB(node, nextNode) {
  const bbcodes = [];
  const pre = [];
  const post = [];
  const pp = wrappingArround.bind(null, { pre, post });
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

@autobind
class Editor extends Component {
  static propTypes = {
    target: PropTypes.string,
  }

  constructor(comProps) {
    super(comProps);

    this.editableNode = null;
    this.onChangeThrottled = _.throttle(this.onChange, 500);
  }

  componentWillReceiveProps(nextProps) {

  }

  shouldComponentUpdate(nextProps) {
    return false;
  }

  componentDidMount() {
    require('./style.less');
  }

  onChange(e) {
    console.log('Change')
    const { target } = this.props;
    const bbcode = parseToBB(this.editableNode);
    document.getElementById(target).value = bbcode;
  }

  render() {
    console.log('Editor');
    return (
      <div className="editor-wrapper">
        <div className="toolbar">
          <Command command="undo" faClass="undo" />
          <Command command="redo" faClass="repeat" />
          <CommandColor
            command="forecolor"
            palette={['black', 'sienna', 'darkolivegreen', 'darkgreen', 'darkslateblue', 'navy', 'indigo', 'darkslategray', 'darkred', 'darkorange', 'olive', 'green', 'teal', 'blue', 'slategray', 'dimgray', 'red', 'sandybrown', 'yellowgreen', 'seagreen', 'mediumturquoise', 'royalblue', 'purple', 'gray', 'magenta', 'orange', 'yellow', 'lime', 'cyan', 'deepskyblue', 'darkorchid', 'silver', 'pink', 'wheat', 'lemonchiffon', 'palegreen', 'paleturquoise', 'lightblue', 'plum', 'white']}
          />
          {/*
          <div className="fore-wrapper"><i className="fa fa-font" style="color:#C96;"></i>
            <div className="fore-palette">
            </div>
          </div>
          <div className="back-wrapper"><i className="fa fa-font" style="background:#C96;"></i>
            <div className="back-palette">
            </div>
          </div>
          */}
          <Command command="bold" faClass="bold" />
          <Command command="italic" faClass="italic" />
          <Command command="underline" faClass="underline" />
          <Command command="strikeThrough" faClass="strikethrough" />
          <Command command="justifyLeft" faClass="align-left" />
          <Command command="justifyCenter" faClass="align-center" />
          <Command command="justifyRight" faClass="align-right" />
          <Command command="indent" faClass="indent" />
          <Command command="outdent" faClass="outdent" />
          <Command command="insertUnorderedList" faClass="list-ul" />
          <Command command="insertOrderedList" faClass="list-ol" />
          <CommandFormatBlock block="h1" />
          <CommandFormatBlock block="h2" />
          <CommandFormatBlock block="h3" />
          <CommandFormatBlock block="h4" />
          <CommandPrompt command="createlink" faClass="link" ask="Link:" def="http://" />
          <Command command="unlink" faClass="unlink" />
          <CommandPrompt command="insertimage" faClass="image" ask="Link:" def="http://" />
          <CommandFormatBlock block="p" />
        </div>
        <div
          className="editor"
          contentEditable="true"
          onInput={this.onChangeThrottled}
          ref={(editableNode) => { this.editableNode = editableNode; }}
          dangerouslySetInnerHTML={{ __html: `<div>left<br><div style="text-align: right;">right<br><div style="text-align: center;">right</div></div>center<br><br></div><div><br></div><div>Test normal test</div><!-- react-text: 123 -->Test text with emo<!-- /react-text --><img class="sticker" alt="https://i.imgur.com/gzNgdi2.gif" src="https://i.imgur.com/gzNgdi2.gif"><div><!-- react-text: 126 -->Test <!-- /react-text --><b>bold </b><!-- react-text: 128 -->text<!-- /react-text --></div><div><!-- react-text: 130 -->Test <!-- /react-text --><i>italic</i><!-- react-text: 132 --> text<!-- /react-text --><br><!-- react-text: 134 -->shift enter<!-- /react-text --></div><div><!-- react-text: 136 -->Test <!-- /react-text --><u>underline</u><!-- react-text: 138 --> text<!-- /react-text --></div><div><!-- react-text: 140 -->Test <!-- /react-text --><u><strike>strikethrough and underline</strike></u><!-- react-text: 143 -->&nbsp;text<!-- /react-text --></div><div><!-- react-text: 145 -->test <!-- /react-text --><a href="https://vozforums.com/showthread.php?p=124291205#">hyperlink</a><!-- react-text: 147 -->&nbsp;&nbsp;<!-- /react-text --></div><p>Test P</p><p><!-- react-text: 150 -->Test voz emo&nbsp;<!-- /react-text --><img alt=":sexy:" src="https://vozforums.com/images/smilies/Off/sexy_girl.gif"><br></p><p style="text-align: left;">left</p><p style="text-align: center;">center<br>center</p><p style="text-align: right;">right<br><div style="text-align: left;">dsad</div></p>` }}
        >
        </div>
      </div>
    );
  }
}

export default Editor;
