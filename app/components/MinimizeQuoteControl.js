import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import { render } from 'react-dom';

class MinimizeQuote extends Component {
  static propTypes = {
    element: PropTypes.any,
  }

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  render() {
    const { isOpen } = this.state;
    const { element } = this.props;

    return (
      <div className="mini-quote-wrapper" >
        <div
          className={isOpen ? 'quote open' : 'quote'}
          dangerouslySetInnerHTML={{ __html: element }}
        >
        </div>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div
            className="btn btn-minimize-quote"
            onClick={() => { this.setState({ isOpen: !this.state.isOpen }); }}
          >{isOpen ? 'Click to collapse quote' : 'Click to see full quote'}</div>
        </div>
      </div>
    );
  }
}

class MinimizeQuoteControl extends Component {
  static propTypes = {
    isMinimizeQuote: PropTypes.bool,
    maxHeight: PropTypes.number,
    currentView: PropTypes.string,
  }

  static defaultProps = {
    isMinimizeQuote: true,
    maxHeight: 200,
  }

  componentWillReceiveProps(nextProps) {
    this.minimizeQuotes(nextProps);
  }

  minimizeQuotes(nextProps = this.props) {
    const { isMinimizeQuote, currentView, maxHeight } = nextProps;

    if (isMinimizeQuote && currentView === 'thread') {
      const quotes = $('table.voz-bbcode-quote');

      if (quotes) {
        quotes.each(function f() {
          const parent = $(this).parent();

          if (parent.height() > maxHeight) {
            const html = parent.html();
            const wrapper = document.createElement('div');
            wrapper.className = 'quote-minimize-wrapper';
            parent.empty().append(wrapper);
            render(<MinimizeQuote element={html} />, wrapper);
          }
        });
      }
    }
  }

  render() { return null; }
}

export default MinimizeQuoteControl;
