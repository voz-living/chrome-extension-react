/* eslint-disable react/no-multi-comp,react/prefer-stateless-function */
import React, { Component } from 'react';
import {
  getChromeLocalStore,
  defaultStoreStructure,
} from '../app/utils/settings';
import { autobind } from 'core-decorators';
import NumberConfigItem from './NumberConfigItem';
import OnOffConfigItem from './OnOffConfigItem';
import TextConfigItem from './TextConfigItem';
import { setConfig } from './ConfigItem';

const defaultSettings = defaultStoreStructure.settings;

export function getConfig() {
  return getChromeLocalStore(['settings'])
    .then((result) => Object.assign({}, defaultSettings, result.settings));
}

export function updateConfig(name, value) {
  return getConfig()
    .then(config => setConfig(name, value, config));
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
        <h3>Chung (General)</h3>
        <OnOffConfigItem configKey="wideScreen" parent={parent} >Dàn trang ra 2 bên</OnOffConfigItem>
        <OnOffConfigItem configKey="wideScreenSpecial" parent={parent} >Dàn trang ra 2 bên (Special - chọn nếu trên có lỗi)</OnOffConfigItem>
        <OnOffConfigItem configKey="adsRemove" parent={parent} >Xoá quảng cáo</OnOffConfigItem>
        <OnOffConfigItem configKey="notifyQuote" parent={parent} >Thông báo trích dẫn</OnOffConfigItem>
        <NumberConfigItem configKey="delay" parent={parent} >Cường độ quét trích dẫn (phút)</NumberConfigItem>
        <NumberConfigItem configKey="delayFollowThread" parent={parent} max={60*24} min={1} >Cường độ quét thớt theo dõi (phút)</NumberConfigItem>
        <OnOffConfigItem configKey="autoHideSidebar" parent={parent} >Tự động ẩn thanh công cụ</OnOffConfigItem>
        <OnOffConfigItem configKey="LinhXinhBtn" parent={parent} >Hiện LinhXinh ở thanh công cụ</OnOffConfigItem>
        <TextConfigItem configKey="userStyle" parent={parent} > 
          userStyle Url &nbsp;
          <a href="https://github.com/voz-living/chrome-extension-react/wiki/Feature:-Tu%E1%BB%B3-ch%E1%BB%8Dn-style-v%E1%BB%9Bi-userStyle">
            (?)  
          </a>&nbsp;
        </TextConfigItem>
        <h3>Trang danh sách thớt (Thread List)</h3>
        <OnOffConfigItem configKey="threadPreview" parent={parent} >Xem trước thớt</OnOffConfigItem>
        <OnOffConfigItem configKey="reloadButton" parent={parent} >Làm mới nhanh danh sách thớt</OnOffConfigItem>
        <OnOffConfigItem configKey="autoGotoNewthread" parent={parent} >Tự đi tới bài mới nhất</OnOffConfigItem>
        <h3>Trong thớt/Bài viết (Thread/Posts)</h3>
        <OnOffConfigItem configKey="newThreadUI" parent={parent} >Giao diện mới (Tải trang nhanh) (tạm không sử dụng được)</OnOffConfigItem>
        <OnOffConfigItem configKey="smartSelection" parent={parent} >Hiện công cụ khi quét chữ</OnOffConfigItem>
        <OnOffConfigItem configKey="emotionHelper" parent={parent} >Thêm emoticon</OnOffConfigItem>
        <OnOffConfigItem configKey="linkHelper" parent={parent} >Tự động xử lý link</OnOffConfigItem>
        <OnOffConfigItem configKey="minimizeQuote" parent={parent} >Tự động thu nhỏ trích dẫn</OnOffConfigItem>
        <OnOffConfigItem configKey="quickPostQuotation" parent={parent} >Trích dẫn nhanh</OnOffConfigItem>
        <OnOffConfigItem configKey="capturePostEnable" parent={parent} >
          Chụp bài viết / Capture Post
          &nbsp;<a href="https://github.com/voz-living/chrome-extension-react/wiki/Feature:-Ch%E1%BB%A5p-h%C3%ACnh-b%C3%A0i-vi%E1%BA%BFt">(?)</a>
        </OnOffConfigItem>
        <OnOffConfigItem configKey="savePostEnable" parent={parent} >
          Lưu bài viết (post)
          &nbsp;<a href="https://github.com/voz-living/chrome-extension-react/wiki/Feature:-L%C6%B0u-b%C3%A0i-vi%E1%BA%BFt">(?)</a>
        </OnOffConfigItem>
        <hr />
        <div className="warning">Tuỳ chọn mới sẽ được áp dụng khi bạn tải trang mới hoặc tải lại trang</div>
      </div>
    );
    /* eslint-enable max-len */
  }
}
