import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  markAllQuoteSeen,
} from '../actions/voz';

class QuoteList extends Component {
  static propTypes = {
    settings: PropTypes.object,
    dispatch: PropTypes.func,
    quoteList: PropTypes.array,
    countUnseen: PropTypes.number,
    advancedNotifyQuote: PropTypes.bool,
  }

  static defaultProps = {
    quoteList: [],
    settings: {},
    countUnseen: 0,
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
    /* eslint-disable max-len */
    return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)} ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    /* eslint-enable max-len */
  }

  toggleQuoteList() {
    const { showQuoteList } = this.state;
    const { countUnseen } = this.props;

    if (showQuoteList === false && countUnseen !== 0) {
      this.dispatch(markAllQuoteSeen());
      chrome.runtime.sendMessage({ continueNotify: true });
    }
    this.setState({ showQuoteList: !showQuoteList });
  }

  renderQuote(quote) {
    return (
      <div className={`quote-row${quote.selfQuote ? ' self-quote' : ''}`} key={quote.post.id} style={(this.props.advancedNotifyQuote && quote.selfQuote) === true ? { display: 'none' } : null}>
        <div className="quote-title">
          <a href={`showthread.php?p=${quote.post.id}#post${quote.post.id}`} target="_blank">
            {quote.thread.title}
          </a>
        </div>
        <div className="quote-content" style={{ wordBreak: 'break-word' }}>{quote.post.content}</div>
        <div className="quote-bottom">
          By <a
            className="quote-item-author"
            href={`/member.php?u=${quote.author.userid}`} target="_blank"
          >({quote.author.username})
          </a> @ {this.getTime(quote.post.datetime)}
        </div>
      </div>
    );
  }

  render() {
    const { notifyQuote } = this.props.settings;

    if (!notifyQuote) return null;

    const { quoteList, countUnseen } = this.props;

    return (
      <div className="btn-group">
        <div
          className={`btn tooltip-right ${(this.state.showQuoteList ? 'active' : '')}`}
          onClick={() => this.toggleQuoteList()}
          data-tooltip="Quote list"
        >
          <i className="fa fa-quote-right"></i>
          <div className="badge">{countUnseen}</div>
        </div>
        {(() => {
          if (this.state.showQuoteList) {
            return [
              <div
                key="voz-mask-quote-list"
                className="voz-mask quote-list-mask"
                onClick={() => this.setState({ showQuoteList: !this.state.showQuoteList })}
              ></div>,
              <div className="btn-options" key="quote-list">
                <h3>Quotes
                  <a
                    style={{
                      color: 'red',
                      fontSize: '10px',
                      marginLeft: '8px',
                      textShadow: '0 0 3px rgba(255,255,255,1)',
                    }}
                    title="Bấm để xem tính năng mới của voz trong tab mới"
                    target="_blank"
                    href="https://github.com/voz-living/chrome-extension-react/wiki/Feature:-Tr%C3%ADch-d%E1%BA%ABn-n%C3%A2ng-cao-(d%C3%A0nh-cho-c%C3%A1c-id-ph%E1%BB%95-bi%E1%BA%BFn)">
                    Bạn bị nhận quá nhiều quote không liên quan vì tên id phổ biến ?
                  </a>
                </h3>
                
                <div className="quote-list">
                  {quoteList.map(quote => this.renderQuote(quote))}
                </div>
              </div>,
            ];
          }
          return null;
        })()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { quoteList, settings } = state.vozLiving;
  const countUnseen = quoteList.reduce((r, q) => {
    let outResult = r;
    if (q.hasSeen === false) outResult += 1;
    return outResult;
  }, 0);

  return { quoteList, settings, countUnseen };
};

export default connect(mapStateToProps)(QuoteList);
