import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SettingOptions from '../components/SettingOptions';
import ReloadButton from '../components/ReloadButton';
import QuoteList from '../components/QuoteList';
import QuickLink from '../components/QuickLink';
import FollowThread from '../components/FollowThread';
import Subscription from '../components/Subscription';

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
        <ReloadButton dispatch={this.dispatch} />
        <QuickLink dispatch={this.dispatch} />
        <div className="voz-living-size-menu__bottom">
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
