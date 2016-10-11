import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SettingOptions from '../components/SettingOptions';
import ReloadButton from '../components/ReloadButton';
import QuoteList from '../components/QuoteList';

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
        <ReloadButton dispatch={this.dispatch} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { settings } = state.vozLiving;
  return { settings };
};

export default connect(mapStateToProps)(SideMenu);
