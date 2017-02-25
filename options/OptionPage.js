/* eslint-disable react/no-multi-comp,react/prefer-stateless-function */
import React, { Component, PropTypes } from 'react';
import {
  getChromeLocalStore,
  setChromeLocalStore,
  defaultStoreStructure,
} from '../app/utils/settings';
import { autobind } from 'core-decorators';

const defaultSettings = defaultStoreStructure.settings;

function getConfig() {
  return getChromeLocalStore(['settings'])
    .then((result) => Object.assign({}, defaultSettings, result.settings));
}

function setConfig(name, value, settings) {
  return setChromeLocalStore({ settings: {
    ...settings,
    [name]: value,
  } });
}

@autobind
class ConfigItem extends Component {
  static propTypes = {
    configKey: PropTypes.string,
    parent: PropTypes.object,
    helpText: PropTypes.string,
    helpUrl: PropTypes.string,
  }

  getValue() {
    return this.props.parent.settings[this.props.configKey];
  }

  setValue(val) {
    setConfig(this.props.configKey, val, this.props.parent.settings);
    this.props.parent.updateConfig();
  }

  renderConfig() {
    return null;
  }

  render() {
    return (
      <div className="item-wrapper">
        {this.renderConfig()}
      </div>
    );
  }
}

@autobind
class OnOffConfigItem extends ConfigItem {

  toggleCheckBoxHandler() {
    this.setValue(!this.getValue());
  }

  renderConfig() {
    return (
      <label className="on-off-item">
        <input type="checkbox" checked={this.getValue()} onChange={this.toggleCheckBoxHandler} />
        {this.props.children}
      </label>
    );
  }
}
@autobind
class NumberConfigItem extends ConfigItem {

  changeHandler(e) {
    this.setValue(e.target.value);
  }

  renderConfig() {
    const { min = 0, step = 1, max = 1000 } = this.props;
    return (
      <label className="on-off-item">
        {this.props.children}
        <input
          type="number"
          value={this.getValue()}
          onChange={this.changeHandler}
          min={min}
          max={max}
          step={step}
        />
      </label>
    );
  }
}

@autobind
export default class OptionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {},
    };
    this.updateConfig();
  }

  updateConfig() {
    getConfig().then(settings => this.setState({ settings }));
  }
  render() {
    const { settings } = this.state;
    const updateConfig = this.updateConfig;
    const parent = { settings, updateConfig };
    console.log(settings);
    /* eslint-disable max-len */
    return (
      <div>
        <OnOffConfigItem configKey="wideScreen" parent={parent} >Dàn trang ra 2 bên</OnOffConfigItem>
        <OnOffConfigItem configKey="adsRemove" parent={parent} >Xoá quảng cáo</OnOffConfigItem>
        <OnOffConfigItem configKey="threadPreview" parent={parent} >Xem trước thớt</OnOffConfigItem>
        <OnOffConfigItem configKey="reloadButton" parent={parent} >Làm mới nhanh danh sách thớt</OnOffConfigItem>
        <OnOffConfigItem configKey="emotionHelper" parent={parent} >Thêm emoticon</OnOffConfigItem>
        <OnOffConfigItem configKey="linkHelper" parent={parent} >Tự động xử lý link</OnOffConfigItem>
        <OnOffConfigItem configKey="notifyQuote" parent={parent} >Thông báo trích dẫn</OnOffConfigItem>
        <OnOffConfigItem configKey="minimizeQuote" parent={parent} >Tự động thu nhỏ trích dẫn</OnOffConfigItem>
        <OnOffConfigItem configKey="quickPostQuotation" parent={parent} >Trích dẫn nhanh</OnOffConfigItem>
        <OnOffConfigItem configKey="savePostEnable" parent={parent} >Lưu bài viết (post)</OnOffConfigItem>
        <OnOffConfigItem configKey="autoHideSidebar" parent={parent} >Tự động ẩn thanh công cụ</OnOffConfigItem>
        <OnOffConfigItem configKey="peerChatEnable" parent={parent} >Peer Chat</OnOffConfigItem>
        <NumberConfigItem configKey="delay" parent={parent} >Cường độ quét trích dẫn (phút)</NumberConfigItem>
        <hr/>
        <div className="warning">Tuỳ chọn mới sẽ được áp dụng khi bạn tải trang mới hoặc tải lại trang</div>
      </div>
    );
    /* eslint-enable max-len */
  }
}
