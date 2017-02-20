import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  markAllQuoteSeen,
} from '../actions/voz';

class FollowThread extends Component {
  static propTypes = {
    settings: PropTypes.object,
    dispatch: PropTypes.func,
    threadList: PropTypes.array,
  }

  static defaultProps = {
    threadList: [],
    settings: {},
  }

  constructor(comProps) {
    super(comProps);

    this.state = {
      showThreadList: false,
    };
    this.dispatch = comProps.dispatch;
  }

  getTime(timeStamp) {
    const date = new Date(timeStamp);
    /* eslint-disable max-len */
    return `${date.getHours()}:${date.getMinutes()} ${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    /* eslint-enable max-len */
  }

  toggleThreadList() {
    const { showThreadList } = this.state;
    const { countUnseen } = this.props;

    if (showThreadList === false && countUnseen !== 0) {
      this.dispatch(markAllQuoteSeen());
    }
    this.setState({ showThreadList: !showThreadList });
  }

  renderQuote(quote) {
    return (
      <div className="quote-row" key={quote.post.id}>
        <div className="quote-title">
          <a href={`/showthread.php?t=${quote.thread.id}`} target="_blank">
            {quote.thread.title}
          </a>
          <a
            className="pull-right" target="_blank"
            href={`showthread.php?p=${quote.post.id}#post${quote.post.id}`}
          >
            <i className="fa fa-share"></i>
          </a>
        </div>
        <div className="quote-content">{quote.post.content}</div>
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
    const { threadList } = this.props;

    return (
      <div className="btn-group">
        <div
          className="btn"
          onClick={() => this.toggleThreadList()}
        >
          <i className="fa fa-th-list"></i>
        </div>
        {(() => {
          if (this.state.showThreadList) {
            return [
              <div
                key="voz-mask-quote-list"
                className="voz-mask quote-list-mask"
                onClick={() => this.setState({ showThreadList: !this.state.showThreadList })}
              ></div>,
              <div className="btn-options" key="quote-list">
                <h3>Quotes</h3>
                <div className="quote-list">
                  {threadList.map(quote => this.renderQuote(quote))}
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
  const { followThreads, settings } = state.vozLiving;
  console.log(followThreads);
  return { threadList: followThreads, settings };
};

export default connect(mapStateToProps)(FollowThread);
