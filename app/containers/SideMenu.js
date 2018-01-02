import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SettingOptions from '../components/SettingOptions';
import ReloadButton from '../components/ReloadButton';
import QuoteList from '../components/QuoteList';
import QuickLink from '../components/QuickLink';
import FollowThread from '../components/FollowThread';
import Subscription from '../components/Subscription';
import SavedPostSideBarIcon from '../components/SavedPost/SideBarIcon';
import LXBtn from '../components/LXBtn';
import FeedbackBtn from '../components/FeedbackBtn';
// import HotThreads from '../components/HotThreads';
import { toClassName } from '../utils';
import MultiAccounts from "../components/MultiAccounts";

class SideMenu extends Component {
  static propTypes = {
    settings: PropTypes.object,
    dispatch: PropTypes.func,
    autoHide: PropTypes.bool,
    advancedNotifyQuote: PropTypes.bool,
    multiAcc: PropTypes.bool,
    currentView: PropTypes.string,
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
    const { settings, autoHide, advancedNotifyQuote, multiAcc, currentView } = this.props;

    return (
      <div className={toClassName({ 'voz-living-side-menu': true, 'trans-start': true, 'auto-hide': autoHide })}>
        <SettingOptions settings={settings} dispatch={this.dispatch} />
        <QuoteList dispatch={this.dispatch} advancedNotifyQuote={advancedNotifyQuote} />
        <FollowThread dispatch={this.dispatch} />
        <ReloadButton dispatch={this.dispatch} isReloadButton={settings.reloadButton} />

        {settings.savePostEnable === true ? <SavedPostSideBarIcon dispatch={this.dispatch} /> : null}
        {settings.LinhXinhBtn === true ? <LXBtn /> : null}
        {multiAcc && <MultiAccounts currentView={currentView} />}
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
