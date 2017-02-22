import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { GET } from '../utils/http';
import $ from 'jquery';
import { render } from 'react-dom';
import Cookie from 'tiny-cookie';
import { autobind } from 'core-decorators';

@autobind
class QuickPostQuotation extends Component {
  static propTypes = {
    editor: PropTypes.any,
    href: PropTypes.string,
  }

  getQuotes() {
    const { editor, href } = this.props;

    if (editor && href) {
      editor.attr('disabled', 'disabled');

      GET(href).then(response => { // eslint-disable-line
        editor.removeAttr('disabled');
        const text = _.trim($(response).find('#vB_Editor_001_textarea').val());
        const selStart = editor.prop('selectionStart');
        const selEnd = editor.prop('selectionEnd');
        const value = editor.val();
        const textBefore = value.substring(0, selStart);
        const textAfter = value.substring(selEnd, value.length);

        editor.val(textBefore + text + textAfter);
        editor[0].setSelectionRange(selStart + text.length, selStart + text.length);
        editor.focus();

        this.clearQuotes();
      });
    }
  }

  clearQuotes() {
    Cookie.set('vbulletin_multiquote', '');
    const httpsOn = '[src="https://vozforums.com/images/buttons/multiquote_on.gif"]';
    const httpsOff = 'https://vozforums.com/images/buttons/multiquote_off.gif';
    const httpOn = '[src="http://vozforums.com/images/buttons/multiquote_on.gif"]';
    const httpOff = 'http://vozforums.com/images/buttons/multiquote_off.gif';

    // this look stupid
    if ($(httpsOn)) $(httpsOn).attr('src', httpsOff);
    if ($(httpOn)) $(httpOn).attr('src', httpOff);
  }

  render() {
    return (
      <div className="voz-living-quick-post-quotation">
        <div className="text">
          Click vào nút <img src="https://vozforums.com/images/buttons/multiquote_off.gif" alt="" /> ở bên dưới-phải của mỗi bài viết để Load Quotes <br />
        </div>
        <div className="control">
          <a onClick={this.clearQuotes}>Reset Quotes</a>
          <a onClick={this.getQuotes}>Load Quotes</a>
        </div>
      </div>
    );
  }
}

class QuickPostQuotationControl extends Component {
  static propTypes = {
    isQuickPostQuotation: PropTypes.bool,
    currentView: PropTypes.string,
  }

  componentWillReceiveProps(nextProps) {
    this.addQuickPostQuotation(nextProps);
  }

  addQuickPostQuotation(nextProps = this.props) {
    const { isQuickPostQuotation, currentView } = nextProps;

    if (isQuickPostQuotation && currentView === 'thread') {
      const editor = $('#vB_Editor_QR_textarea');
      if (editor.length === 0) return;

      const editorCont = editor.parents('#vB_Editor_QR').eq(0);
      const toolbar = $('<div class="voz-living-quick-quote-quotation"></div>');
      const href = $("a:has(>img[src*='images/buttons/reply.gif'])")[0].href;

      if (editorCont.length === 0) return;
      editorCont.append(toolbar);

      render(<QuickPostQuotation href={href} editor={editor} />, toolbar[0]);
    }
  }

  render() { return null; }
}

export default QuickPostQuotationControl;
