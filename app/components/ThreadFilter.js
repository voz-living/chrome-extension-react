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
  };

  static defaultProps = {
    filterList: [],
    rules: {},
    needUpdate: false,
    ignoreList: [],
  };

  constructor(props) {
    super(props);
    const mods = [];
    $('[action^="forumdisplay"] table .alt1:nth-child(2) .smallfont a').each(function f() {
      mods.push($(this).text());
    });
    this.state = {
      isOpen: false,
      filterList: this.props.filterList,
      needUpdate: this.props.needUpdate,
      rules: this.props.rules,
      mods,
    };
  }

  componentWillMount() {
    const { needUpdate } = this.state;
    if (needUpdate) this.generateRules();
  }

  componentDidMount() {
    const oThis = this;
    $('[id^="threadbits_forum"] > tr').each(function f() {
      const $this = $(this);
      if (!$this.find('td:nth-child(4)').length || // deleted posts have <= 4 columns (3 normal, 4 special)
        $this.find('td:nth-child(4)').text().match(/Thread deleted|^-$/i)) return; // moved posts have columns 3,4,5(or 4,5,6) = '-'
      const title = $this.find('[id^=thread_title]').text();
      const user = $this.find('[id^="td_threadtitle"] > .smallfont > span').last().text();
      const info = $this.find('.alt2[title]').prop('title').replace(/,/g, '').match(/(\d+)/g);
      const replies = parseInt(info[0], 10);
      const views = parseInt(info[1], 10);
      const sticky = $this.find('[id^="td_threadtitle"] .inlineimg[alt^="Sticky"]').length > 0;
      // console.log([title, user, replies, views, sticky]);
      const classes = oThis.verifyMatch(title, user, replies, views, sticky);
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
        alert('Không tìm thấy user');
      }
    });
  }

  modifyThread() {
    let sequence = 0;
    $('[id^="threadbits_forum"] > tr').each(function f() {
      const $this = $(this);
      let postContent = '';
      if ($this.hasClass('highlight')) {
        sequence++;
        if (sequence > 1) $this.addClass('voz-living-in-sequence');
      } else {
        if (sequence > 0) sequence = 0;
      }
      if ($this.hasClass('blacklist') && !$this.hasClass('whitelist')) {
        const name = $this.find('[id^="td_threadtitle"] > .smallfont > span').last().text();
        postContent = $this.html();
        $this.html(`<td></td>${$('table tbody tr .thead[colspan="2"]').length ? '<td></td>' : ''}
            <td style="font-size:10px;padding:2px 6px">Thớt của ${name} đã bị ẩn bởi Voz living. 
            <a class="vl-show-post">Hiện lại</a></td>`);
        $(this).find('a.vl-show-post').one('click', () => {
          $this.hide().html(postContent).fadeIn(500);
        });
      }
    });
  }

  verifyMatch(title, user, replies, views, sticky) {
    const types = [];
    const { ignoreList } = this.props;
    const { mods } = this.state;
    for (const key of Object.keys(this.state.rules)) {
      const list = this.state.rules[key];
      if ((list.ignore && ignoreList.indexOf(user) !== -1) ||
        (list.leaders && BAN_QUAN_TRI.indexOf(user) !== -1) ||
        (list.sticky && sticky) ||
        (list.views.greaterThan !== '' && views >= list.views.greaterThan) ||
        (list.views.lessThan !== '' && views < list.views.lessThan) ||
        (list.replies.greaterThan !== '' && replies > list.replies.greaterThan) ||
        (list.replies.lessThan !== '' && replies <= list.replies.lessThan) ||
        (list.mods && mods.indexOf(user) !== -1)) {
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
    filterList.push({ listType: 'blacklist', type: 'ignore', regEx: 'ignore-case', matchThread: '', matchMember: '', views: '', replies: '', sign: 'less-than' });
    this.setState({ filterList });
  }

  removeRule(i) {
    const { filterList } = this.state;
    filterList.splice(i, 1);
    this.setState({ filterList });
  }

  validateRegex(event) {
    try {
      const valid = new RegExp(event.target.value);
      if (event.target.className === 'invalid') event.target.className = '';
    } catch (err) {
      event.target.className = 'invalid';
    }
  }

  handleChange(event, i, type) {
    const { filterList } = this.state;
    const value = event.target.value;
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
        filterList[i].views = parseInt(value, 10);
        break;
      case 'replies':
        filterList[i].replies = parseInt(value, 10);
        break;
      default: console.log('oops');
    }
  }

  saveFilter() {
    const { filterList } = this.state;
    if ($('.vl-filter-table').find('.invalid').length) {
      alert('Bạn hãy sửa những lỗi ở vùng màu đỏ');
    } else {
      setChromeLocalStore({ filterList, needUpdate: true });
      alert('Lưu thành công');
    }
  }

  generateRules() {
    const { filterList } = this.state;
    setChromeLocalStore({ needUpdate: false });
    const rules = {
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
        rule.matchMember += `(?:${list.matchMember})|`;
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
      }
    }
    rules.blacklist.matchMember = rules.blacklist.matchMember.replace(/\|$/, '');
    rules.whitelist.matchMember = rules.whitelist.matchMember.replace(/\|$/, '');
    rules.highlight.matchMember = rules.highlight.matchMember.replace(/\|$/, ''); // looks ridiculous
    this.setState({ rules });
    setChromeLocalStore({ rules });
  }

  render() {
    const { currentView } = this.props;
    const { isOpen, filterList } = this.state;
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
                  <tr key={Math.random()}>
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
                    </td>
                    <td>
                      <button onClick={() => { this.removeRule(i); }} ><i className="fa fa-times" /></button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
              <div>
                <button onClick={() => { this.addNewRule(); }}>Thêm quy tắc mới</button>&nbsp;
                <button onClick={() => { this.saveFilter(); }}>Lưu bộ lọc</button>
                &nbsp;<button onClick={() => { this.getIgnoreList(); }}>Update ignore list</button>
              </div>
            </div>,
          ])}
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = state => {
  const { filterList, needUpdate, rules, ignoreList } = state.vozLiving;
  return { filterList, needUpdate, rules, ignoreList };
};

export default connect(mapStateToProps)(ThreadFilter);
