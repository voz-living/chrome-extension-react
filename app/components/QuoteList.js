import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class QuoteList extends Component {
  static propTypes = {
    settings: PropTypes.object,
    dispatch: PropTypes.func,
    quoteList: PropTypes.array,
  }

  static defaultProps = {
    quoteList: [],
    settings: {},
  }

  constructor(comProps) {
    super(comProps);

    this.state = {
      showQuoteList: false,
    };
    this.dispatch = comProps.dispatch;
  }

  getTime(timeStamp) {
    const date = new Date(timeStamp);
    return `${date.getHours()}:${date.getMinutes()} ${date.getDay()}-
            ${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  renderQuote(quote) {
    return (
      <div className="quote-row" key={quote.post.id}>
        <div className="quote-title">{quote.thread.title}</div>
        <div className="quote-content">{quote.post.content}</div>
        <div className="quote-bottom">
          By <a className="quote-item-author">
            ({quote.author.username})
          </a> on {this.getTime(quote.post.datetime)}
        </div>
      </div>
    );
  }

  render() {
    const { notifyQuote } = this.props.settings;

    if (!notifyQuote) return null;

    const { quoteList } = this.props;

    return (
      <div className="btn-group">
        <div
          className="btn"
          onClick={() => this.setState({ showQuoteList: !this.state.showQuoteList })}
        ><i className="fa fa-quote-right"></i></div>
        {(() => {
          if (this.state.showQuoteList) {
            return (
              <div className="btn-options">
                <h3>Quotes</h3>
                {quoteList.map(quote => this.renderQuote(quote))}
              </div>
            );
          }
          return null;
        })()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { quoteList, settings } = state.vozLiving;
  return { quoteList, settings };
};

export default connect(mapStateToProps)(QuoteList);
