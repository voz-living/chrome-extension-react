import { Component, PropTypes } from 'react';
import $ from 'jquery';

class AdsControl extends Component {
  static propTypes = {
    isRemoveAds: PropTypes.bool,
  }

  componentWillReceiveProps(nextProps) {
    this.removeAds(nextProps);
  }

  removeAds(nextProps = this.props) {
    const { isRemoveAds } = nextProps;

    if (isRemoveAds) {
      if ($('.middleads+table > tbody > tr > td:eq(1) [id^=div-gpt-ad]').length > 0) {
        $('.middleads+table > tbody > tr > td:eq(1)').remove();
      }
      $('.middleads+div > table > tbody > tr > td:eq(1)').remove();
      $('[id^=div-gpt-ad]').hide();
      $('[id^=google_ads_div],.middleads').hide();
    }
  }

  render() { return null; }
}

export default AdsControl;
