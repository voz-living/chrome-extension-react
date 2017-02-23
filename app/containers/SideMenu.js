import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SettingOptions from '../components/SettingOptions';
import ReloadButton from '../components/ReloadButton';
import QuoteList from '../components/QuoteList';
import QuickLink from '../components/QuickLink';
import FollowThread from '../components/FollowThread';
import Subscription from '../components/Subscription';

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
  }

  static defaultProps = {
    settings: {},
  }

  constructor(comProps) {
    super(comProps);
    this.dispatch = comProps.dispatch;
  }

  render() {
    return (
      <div className="voz-living-side-menu">
        <SettingOptions settings={this.props.settings} dispatch={this.dispatch} />
        <QuoteList dispatch={this.dispatch} />
        <FollowThread dispatch={this.dispatch} />
        <ReloadButton dispatch={this.dispatch} isReloadButton={this.props.settings.reloadButton} />
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
