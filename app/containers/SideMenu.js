import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SettingOptions from '../components/SettingOptions';
import ReloadButton from '../components/ReloadButton';
import QuoteList from '../components/QuoteList';
import QuickLink from '../components/QuickLink';
import FollowThread from '../components/FollowThread';
import Subscription from '../components/Subscription';
import SavedPostIcon from '../components/SavedPost/Icon';
import { toClassName } from '../utils';

const FeedbackBtn = () => (
  <div className="btn-group">
    <a
      className="btn tooltip-right"
      href="https://voz-living.github.io/voz-living-feedback/"
      style={{ fontSize: '20px' }}
      target="_blank"
      data-tooltip="Góp ý/Báo lỗi/Tâm sự"
    ><i className="fa fa-envelope-o"></i></a>
  </div>
);

class SideMenu extends Component {
  static propTypes = {
    settings: PropTypes.object,
    dispatch: PropTypes.func,
    autoHide: PropTypes.bool,
  }

  static defaultProps = {
    settings: {},
  }

  constructor(comProps) {
    super(comProps);
    this.dispatch = comProps.dispatch;
  }

  componentWillUpdate(nextProps) {
    const contentHtml = [
      document.querySelectorAll('body>div:not(#voz-living-app):not(#voz-living-loader-wrapper)'),
      document.querySelectorAll('body else>div:not(#voz-living-app)'),
      document.querySelectorAll('body>form'),
    ];

    contentHtml.forEach(nodes => {
      if (nodes && nodes.length > 0) {
        nodes.forEach(node => {
          if (node && nextProps.autoHide === true) node.style.marginLeft = '0px';
          if (node && nextProps.autoHide === false) node.style.marginLeft = '50px';
        });
      }
    });
  }

  render() {
    const { settings, autoHide } = this.props;

    return (
      <div className={toClassName({ 'voz-living-side-menu': true, 'auto-hide': autoHide })}>
        <SettingOptions settings={settings} dispatch={this.dispatch} />
        <QuoteList dispatch={this.dispatch} />
        <FollowThread dispatch={this.dispatch} />
        {settings.savePostEnable === true ? <SavedPostIcon dispatch={this.dispatch} /> : null}
        <ReloadButton dispatch={this.dispatch} isReloadButton={settings.reloadButton} />
        <QuickLink dispatch={this.dispatch} />
        <div className="voz-living-size-menu__bottom">
          <FeedbackBtn />
          <Subscription dispatch={this.dispatch} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { settings } = state.vozLiving;
  return { settings };
};

export default connect(mapStateToProps)(SideMenu);
