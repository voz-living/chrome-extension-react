import React, {
  Component,
  PropTypes,
} from 'react';
import $ from 'jquery';
import { toClassName } from '../utils';
import { copyText } from '../utils/clipboard';
import { insertTextIntoEditor } from '../common/editor';

class SmartSelection extends Component {
  constructor(props) {
    super(props);
    this.bindHandlers();
    this.state = {
      features: [],
      x: 0, y: 0,
      textSel: '',
      meta: {},
    };
  }

  bindHandlers = () => {
    document.addEventListener('mouseup', this.mouseUpHandler);
  }

  mouseUpHandler = (e) => {
    const features = [];
    const textSel = window.getSelection().toString();
    let meta = {};
    if (textSel.trim() === '') {
      if (this.state.features.length > 0) {
        setTimeout(() => this.setState({ features: [] }), 200);
      }
      return; // nothing here
    }
    console.log(e);
    features.push(this.fCopy());
    features.push(this.fGG());
    if (e.target.classList.contains('voz-post-message')) {
      const pid = e.target.getAttribute('id').match(/post_message_(\d+)/)[1];
      meta = { pid };
      features.unshift(this.fQuote());
    }
    if (features.length > 0) {
      const x = e.pageX + 5;
      const y = e.pageY + 10;
      this.setState({ features, x, y, textSel, meta });
    }
  }

  fQuote = () => <a onClick={this.quote}><i className="fa fa-quote-right"></i></a>;
  quote = () => {
    const pid = this.state.meta.pid;
    const username = document.querySelector(`#postmenu_${pid}`).innerText.trim();
    const text = `[QUOTE=${username};${pid}]... ${this.state.textSel} ...[/QUOTE]\n`;
    insertTextIntoEditor(text, $('#vB_Editor_QR_textarea'));
  }

  fCopy = () => <a 
    onClick={() => {
      copyText(this.state.textSel)
    }}><i className="fa fa-copy"></i></a>;
  fGG = () => <a 
    onClick={() => {
      window.open('https://www.google.com/?gws_rd=ssl#q=' + this.state.textSel);
    }}><i className="fa fa-google"></i></a>;
  fYT = () => <a 
    onClick={() => {
      window.open('https://www.youtube.com/results?search_query=' + this.state.textSel);
    }}><i className="fa fa-youtube-play"></i></a>;

  render() {
    const { x, y, features } = this.state;
    if (features.length === 0) return null;
    return (
      <div className="voz-living-smart-selection" style={{ left: x, top: y }}>
        {features}
      </div>
    );
  }
}

export default SmartSelection;
