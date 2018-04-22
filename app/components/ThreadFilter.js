/* eslint-disable max-len */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setChromeLocalStore } from '../utils/settings';
import $ from 'jquery';
import { autobind } from 'core-decorators';
import BAN_QUAN_TRI from '../constants/banQuanTri';

@autobind
class ThreadFilter extends Component {
  static propTypes = {
    currentView: PropTypes.string,
    filterList: PropTypes.array,
    rules: PropTypes.object,
    needUpdate: PropTypes.bool,
    ignoreList: PropTypes.array,
    threadsToBeRemoved: PropTypes.string,
    noThreadSight: PropTypes.bool,
  };

  static defaultProps = {
    filterList: [],
    rules: {},
    needUpdate: false,
    ignoreList: [],
    threadsToBeRemoved: '',
    noThreadSight: false,
  };

  constructor(props) {
    super(props);
    const mods = [];
    $('[action^="forumdisplay"] table .alt1:nth-child(2) .smallfont a').each(function f() {
      mods.push($(this).text());  // get all sub-forum mods
    });
    this.state = {
      isOpen: false,
      filterList: this.props.filterList,
      needUpdate: this.props.needUpdate,
      rules: this.props.rules,
      isToggled: false,
      threadsToBeRemoved: this.props.threadsToBeRemoved,
      mods,
      noThreadSight: this.props.noThreadSight,
    };
  }

  componentWillMount() {
    const { needUpdate, threadsToBeRemoved } = this.state;
    if (needUpdate) this.generateRules(); // generate rule when update
    let hideList = threadsToBeRemoved.split('\n');
    hideList = hideList.filter(id => /^\d+/.test(id)); // remove invalids
    hideList = hideList.map(id => id.match(/^\d+/)[0]); // get thread id only
    this.setState({ hideList });
  }

  componentDidMount() {
    const oThis = this; // inside loses scope
    $('[id^="threadbits_forum"] > tr').each(function f() {
      const $this = $(this);
      if (!$this.find('td:nth-child(4)').length || // deleted posts have <= 4 columns (3 normal, 4 special)
        $this.find('td:nth-child(4)').text().match(/Thread deleted|^-$/i)) return; // moved posts have columns 3,4,5(or 4,5,6) = '-'
      $this.find('[id^=thread_title]').after(`<a class="voz-living-hide-thread tooltip-bottom" data-tooltip="Ẩn thread này">
<i class="fa fa-trash"></a>`);
      const title = $this.find('[id^=thread_title]').text();
      const id = $this.children('[id^="td_threadtitle"]').prop('id').match(/\d+/)[0];
      const user = $this.find('[id^="td_threadtitle"] > .smallfont > span').last().text();
      const info = $this.find('.alt2[title]').prop('title').replace(/,/g, '').match(/(\d+)/g);
      const replies = parseInt(info[0], 10);
      const views = parseInt(info[1], 10);
      const sticky = $this.find('[id^="td_threadtitle"] .inlineimg[alt^="Sticky"]').length > 0;
      const pattern = $this.find('.smallfont > span > .inlineimg').prop('src');
      let stars = 0;
      if (pattern) stars = parseInt(pattern.match(/rating_(\d+)/i)[1], 10);
      // console.log([title, user, replies, views, sticky, stars, id]);
      const classes = oThis.verifyMatch(title, user, replies, views, sticky, stars, id);
      if (classes.length) {
        $this.addClass(classes.join(' '));
      }
    });
    this.modifyThread();
  }


  getIgnoreList() {
    $.get('https://vozforums.com/profile.php?do=ignorelist', data => {
      const $elem = $(data).find('#ignorelist a');
      if ($elem.length) {
        const ignoreList = [];
        $elem.each(function f() {
          ignoreList.push($(this).text());
        });
        console.log(ignoreList);
        setChromeLocalStore({ ignoreList });
        alert('Update thành công');
      } else {
        const forceSave = confirm('Không tìm thấy user, vẫn muốn lưu ?');
        if (forceSave) {
          setChromeLocalStore({ ignoreList: [] });
          alert('Đã lưu thành công danh sách trống');
        }
      }
    });
  }

  modifyThread() {
    let sequence = 0; // to prevent duplicate border (looks ugly because of no border-collapse)
    const { noThreadSight } = this.state;
    const oThis = this; // workaround with outside scope
    $('[id^="threadbits_forum"] > tr').each(function f() {
      const $this = $(this);
      if ($this.hasClass('must-hide')) {
        $this.find('.voz-living-hide-thread').remove(); // hide this button if already in list
      } else {
        $this.on('click', '.voz-living-hide-thread', () => { // add info to ignored thread list
          const title = $this.find('[id^=thread_title]').text();
          const id = $this.children('[id^="td_threadtitle"]').prop('id').match(/\d+/)[0];
          const info = `\n${id} - ${title}`;
          const threadsToBeRemoved = (oThis.state.threadsToBeRemoved + info).replace(/^\s*[\r\n]/gm, ''); // regex to remove blank lines
          oThis.setState({ threadsToBeRemoved });
          setChromeLocalStore({ threadsToBeRemoved });
          $this.remove();
        });
      }
      if ($this.hasClass('highlight')) { // sequence counter
        sequence++;
        if (sequence > 1) $this.addClass('voz-living-in-sequence');
      } else {
        if (sequence > 0) sequence = 0;
      }
      if (($this.hasClass('blacklist') && !$this.hasClass('whitelist')) || $this.hasClass('must-hide')) {
        if (noThreadSight) {
          $this.remove();
        } else {
          const name = $this.find('[id^="td_threadtitle"] > .smallfont > span').last().text();
          const postContent = $this.html();
          $this.html(`<td></td>${$('#threadslist').find('.thead[colspan="2"]').length ? '<td></td>' : ''}
            <td style="font-size:10px;padding:2px 6px">Thớt của ${name} đã bị ẩn bởi Voz Living. 
            <a class="vl-show-post">Hiện lại</a></td>`);
          $(this).find('a.vl-show-post').one('click', () => {
            $this.hide().html(postContent).fadeIn(500); // appear animation
          });
        }
      }
    });
  }

  verifyMatch(title, user, replies, views, sticky, stars, id) {
    const types = [];
    const { ignoreList } = this.props;
    const { mods, hideList } = this.state;
    if (hideList.length && hideList.indexOf(id) !== -1) {
      types.push('must-hide'); // force hide no matter what
      return types;
    }
    for (const key of Object.keys(this.state.rules)) {
      const list = this.state.rules[key]; // the type of the list
      if ((list.ignore && ignoreList.indexOf(user) !== -1) ||
        (list.leaders && BAN_QUAN_TRI.indexOf(user) !== -1) ||
        (list.sticky && sticky) ||
        (list.views.greaterThan !== '' && views >= list.views.greaterThan) ||
        (list.views.lessThan !== '' && views < list.views.lessThan) ||
        (list.replies.greaterThan !== '' && replies > list.replies.greaterThan) ||
        (list.replies.lessThan !== '' && replies <= list.replies.lessThan) ||
        (list.mods && mods.indexOf(user) !== -1) ||
        (list.stars.length && list.stars.indexOf(stars) !== -1)) {
        types.push(key);
        continue;
      }
      if (list.matchMember.length) {
        const regex = new RegExp(list.matchMember, 'i');
        if (regex.test(user)) {
          types.push(key);
          continue;
        }
      }
      for (const each of list.matchThread) {
        if (each[0].length) {
          let regex;
          if (each[1] === 'ignore-case') {
            regex = new RegExp(each[0], 'i');
          } else {
            regex = new RegExp(each[0]);
          }
          if (regex.test(title)) {
            types.push(key);
            break;
          }
        }
      }
    }
    return types;
  }

  addNewRule() {
    const { filterList } = this.state;
    const uniqueTime = new Date().getTime(); // a unique key
    filterList.push({ listType: 'blacklist', type: 'ignore', regEx: 'ignore-case', matchThread: '', matchMember: '',
      views: '', replies: '', sign: 'less-than', stars: 0, key: uniqueTime });
    this.setState({ filterList });
  }

  removeRule(i) {
    const { filterList } = this.state;
    filterList.splice(i, 1);
    this.setState({ filterList });
  }

  validateRegex(event) {
    try {
      const valid = new RegExp(event.target.value); // this catches error
      if (event.target.className === 'invalid') event.target.className = '';
    } catch (err) {
      event.target.className = 'invalid';  // turn input red
    }
  }

  handleChange(event, i, type) {
    const { filterList } = this.state;
    const value = event.target.value;
    let number;
    switch (type) {
      case 'type':
        filterList[i].type = value;
        this.setState({ filterList });
        break;
      case 'listType':
        filterList[i].listType = value;
        break;
      case 'matchThread':
        filterList[i].matchThread = value;
        this.validateRegex(event);
        break;
      case 'matchMember':
        filterList[i].matchMember = value;
        this.validateRegex(event);
        break;
      case 'regEx':
        filterList[i].regEx = value;
        break;
      case 'sign':
        filterList[i].sign = value;
        break;
      case 'views':
        number = parseInt(value, 10);
        if (isNaN(number)) return;  // to prevent not a number
        filterList[i].views = number;
        break;
      case 'replies':
        number = parseInt(value, 10);
        if (isNaN(number)) return;
        filterList[i].replies = number;
        break;
      case 'stars':
        filterList[i].stars = parseInt(value, 10);
        break;
      case 'hideList':
        this.state.threadsToBeRemoved = value;
        break;
      default: console.log('oops');
    }
  }

  saveFilter() {
    const { filterList, threadsToBeRemoved } = this.state;
    if ($('.vl-filter-table').find('.invalid').length) {
      alert('Bạn hãy sửa những lỗi ở vùng màu đỏ');
    } else {
      setChromeLocalStore({ filterList, needUpdate: true, threadsToBeRemoved });
      alert('Lưu thành công');
    }
  }

  generateRules() {
    const { filterList } = this.state;
    setChromeLocalStore({ needUpdate: false }); // no unnessary rule update
    const rules = { // an empty initial rule
      highlight: {
        ignore: false,
        matchThread: [],
        matchMember: '',
        views: {
          greaterThan: '',
          lessThan: '',
        },
        replies: {
          greaterThan: '',
          lessThan: '',
        },
        sticky: false,
        leaders: false,
        mods: false,
        stars: [],
      },
      blacklist: {
        ignore: false,
        matchThread: [],
        matchMember: '',
        views: {
          greaterThan: '',
          lessThan: '',
        },
        replies: {
          greaterThan: '',
          lessThan: '',
        },
        sticky: false,
        leaders: false,
        mods: false,
        stars: [],
      },
      whitelist: {
        ignore: false,
        matchThread: [],
        matchMember: '',
        views: {
          greaterThan: '',
          lessThan: '',
        },
        replies: {
          greaterThan: '',
          lessThan: '',
        },
        sticky: false,
        leaders: false,
        mods: false,
        stars: [],
      },
    };
    for (const list of filterList) {
      const rule = rules[list.listType];
      const type = list.type;
      if (type === 'ignore') {
        rule.ignore = true;
      } else if (type === 'sticky') {
        rule.sticky = true;
      } else if (type === 'leaders') {
        rule.leaders = true;
      } else if (type === 'mods') {
        rule.mods = true;
      } else if (type === 'matchThread' && list.matchThread.length) {
        rule.matchThread.push([list.matchThread, list.regEx]);
      } else if (type === 'matchMember' && list.matchMember.length) {
        rule.matchMember += `(?:${list.matchMember})|`; // nested regex proved to be more efficient
      } else if (type === 'views') {
        if (list.sign === 'greater-than') {
          rule.views.greaterThan = list.views;
        } else {
          rule.views.lessThan = list.views;
        }
      } else if (type === 'replies') {
        if (list.sign === 'greater-than') {
          rule.replies.greaterThan = list.replies;
        } else {
          rule.replies.lessThan = list.replies;
        }
      } else if (type === 'stars') {
        rule.stars.push(list.stars);
      }
    }
    rules.blacklist.matchMember = rules.blacklist.matchMember.replace(/\|$/, '');
    rules.whitelist.matchMember = rules.whitelist.matchMember.replace(/\|$/, '');
    rules.highlight.matchMember = rules.highlight.matchMember.replace(/\|$/, ''); // looks ridiculous
    this.setState({ rules });
    setChromeLocalStore({ rules });
    // console.log(rules);
  }

  render() {
    const { currentView } = this.props;
    const { isOpen, filterList, isToggled, threadsToBeRemoved, noThreadSight } = this.state;
    if (currentView === 'thread-list') {
      return (
        <div className={'btn-group'}>
          <a
            className={`btn tooltip-right${isOpen ? ' active' : ''}`}
            href="#"
            style={{ fontSize: '20px' }}
            data-tooltip="Lọc thread"
            onClick={(e) => {
              e.preventDefault();
              this.setState({ isOpen: !this.state.isOpen });
            }}
          ><i className="fa fa-filter" /></a>
          {isOpen &&
          ([
            <div
              key="thread-filter-mask"
              style={{ display: 'block' }}
              className="voz-mask thread-filter-mask"
              onClick={() => $('.vl-filter-table').find('.invalid').length === 0 ? this.setState({ isOpen: !this.state.isOpen }) : ''}
            />,
            <div key="thread-filter-options" className="btn-options" style={{ display: 'flex', height: '450px', width: '565px', overflow: 'auto' }}>
              <h3>Filter list&nbsp;
                <a
                  style={{ fontSize: '10px' }}
                  href="https://github.com/voz-living/chrome-extension-react/wiki/Feature:-L%E1%BB%8Dc-danh-s%C3%A1ch-thread"
                  target="_blank"
                >
                  Đây là gì?
                </a></h3>
              <label style={{ position: 'absolute', right: '5px', top: '13px' }}>
                <input
                  type="checkbox"
                  checked={noThreadSight}
                  onChange={evt => {
                    this.setState({ noThreadSight: evt.target.checked });
                    setChromeLocalStore({ noThreadSight: evt.target.checked });
                  }}
                />Ẩn thread hoàn toàn</label>
              <table className="vl-filter-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Kiểu</th>
                    <th>Lọc theo</th>
                    <th style={{ width: '30px' }}>Xoá</th>
                  </tr>
                </thead>
                <tbody className="filter-body">
                {filterList.map((filter, i) => (
                  <tr key={filter.key || Math.random()}>
                    <td>
                      <select defaultValue={filter.listType} onChange={evt => this.handleChange(evt, i, 'listType')}>
                        <option value="blacklist">Blacklist</option>
                        <option value="whitelist">Whitelist</option>
                        <option value="highlight">Highlight</option>
                      </select>
                    </td>
                    <td>
                      <select defaultValue={filter.type} onChange={evt => this.handleChange(evt, i, 'type')}>
                        <option value="ignore">Ignore list</option>
                        <option value="matchThread">Tên thread</option>
                        <option value="matchMember">Thành viên</option>
                        <option value="views">Số view</option>
                        <option value="replies">Số reply</option>
                        <option value="sticky">Sticky thread</option>
                        <option value="leaders">Thành viên BQT</option>
                        <option value="mods">Mod box này</option>
                        <option value="stars">Số sao</option>
                      </select>
                      {filter.type === 'matchThread' && <span id="filter-by-title" >
                        &nbsp;/<input
                          defaultValue={filter.matchThread}
                          style={{ width: '250px' }}
                          onChange={evt => this.handleChange(evt, i, 'matchThread')}
                        />/
                        <select defaultValue={filter.regEx} onChange={evt => this.handleChange(evt, i, 'regEx')}>
                          <option value="regular" />
                          <option value="ignore-case">i</option>
                        </select>
                      </span>}
                      {filter.type === 'matchMember' && <span id="filter-by-name" >
                        &nbsp;/<input
                          style={{ width: '150px' }}
                          maxLength="25"
                          defaultValue={filter.matchMember}
                          onChange={evt => this.handleChange(evt, i, 'matchMember')}
                        />/
                      </span>}
                      {/views|replies/.test(filter.type) && <span id="filter-by-number">
                        &nbsp;<select defaultValue={filter.sign} onChange={evt => this.handleChange(evt, i, 'sign')}>
                          <option value="less-than">&lt;</option>
                          <option value="greater-than">&gt;=</option>
                        </select>
                        &nbsp;<input
                          defaultValue={filter.type === 'replies' ? filter.replies : filter.views}
                          style={{ width: '100px' }} type="number" step="1"
                          onChange={evt => this.handleChange(evt, i, filter.type)}
                        />
                      </span>}
                      {filter.type === 'stars' && <span id="filter-by-star" >
                        &nbsp;<select defaultValue={filter.stars} onChange={evt => this.handleChange(evt, i, 'stars')}>
                          <option value="0">Không có sao</option>
                          <option value="1">1 sao</option>
                          <option value="2">2 sao</option>
                          <option value="3">3 sao</option>
                          <option value="4">4 sao</option>
                          <option value="5">5 sao</option>
                        </select>
                      </span>}
                    </td>
                    <td>
                      <button onClick={() => { this.removeRule(i); }} ><i className="fa fa-times" /></button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
              <div>
                <button onClick={() => { this.addNewRule(); }}>Thêm quy tắc mới</button>
                &nbsp;<button onClick={() => { this.getIgnoreList(); }}>Update ignore list</button>
                &nbsp;<button onClick={() => { this.setState({ isToggled: !isToggled }); }}>Toggle thread ignore</button>
                &nbsp;<button onClick={() => { this.saveFilter(); }}>Lưu bộ lọc</button>
              </div>
              {isToggled && <div>Danh sách thread bị ẩn (mỗi dòng một id thread, nhớ lưu bộ lọc sau khi sửa):
                <textarea
                  defaultValue={threadsToBeRemoved}
                  style={{ width: '97%', height: '300px' }}
                  onChange={evt => { this.handleChange(evt, '', 'hideList'); }}
                />
              </div>}
            </div>,
          ])}
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = state => {
  const { filterList, needUpdate, rules, ignoreList, threadsToBeRemoved, noThreadSight } = state.vozLiving;
  return { filterList, needUpdate, rules, ignoreList, threadsToBeRemoved, noThreadSight };
};

export default connect(mapStateToProps)(ThreadFilter);
