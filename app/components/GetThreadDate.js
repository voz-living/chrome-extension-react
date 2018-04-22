import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { setChromeLocalStore } from '../utils/settings';

class GetThreadDate extends Component {
  static propTypes = {
    currentView: PropTypes.string,
    threadCreationList: PropTypes.object,
  };

  static defaultProps = {
    threadCreationList: {},
  };

  componentWillMount() {
    const { currentView } = this.props;
    let { threadCreationList } = this.props;
    if (currentView === 'thread-list') {
      const listLength = Object.keys(threadCreationList).length;
      if (listLength >= 1000) { // clear cache when too many threads
        threadCreationList = {};
        setChromeLocalStore({ threadCreationList });
      }
      $('[id^="threadbits_forum"] tr:not(.blacklist)').each(function f() {
        const $this = $(this);
        if ($this.find('td:nth-child(4)').length) { // not a deleted thread
          const id = $this.find('[id^="thread_title"]').prop('id').match(/\d+/)[0];
          const smallname = $this.find('[id^="td_threadtitle"] > .smallfont > span').last();
          let date = threadCreationList[id];
          if (date !== undefined) {
            smallname.after(`<span> &gt;&gt; ${date}</span>`);
          } else {
            $.get(`https://vozforums.com/showthread.php?t=${id}`, data => {
              date = $(data).find('.tborder.voz-postbit').first().find('.thead .normal:nth-child(2)').text().match(/\S+.+/)[0];
              smallname.after(`<span> &gt;&gt; ${date}</span>`);
              threadCreationList[id] = date;
              setChromeLocalStore({ threadCreationList });
            });
          }
        }
      });
    }
  }

  render() {
    return null;
  }
}
const mapStateToProps = state => {
  const { threadCreationList } = state.vozLiving;
  return { threadCreationList };
};

export default connect(mapStateToProps)(GetThreadDate);
