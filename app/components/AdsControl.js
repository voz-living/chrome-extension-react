import { Component, PropTypes } from 'react';
import $ from 'jquery';

class AdsControl extends Component {
  static propTypes = {
    isRemoveAds: PropTypes.bool,
  }

  componentDidMount() {
    $('#neo_logobar').append(`
      <div style="display: block; float: right">
        <h3><a href="https://goo.gl/forms/jgSa6ZXtIsRvLJMj1" target="_blank" style="color: white;">
          <i class="fa fa-wechat"></i> Chat với cộng đồng VozLiving (mở ra tab mới)
        </a></h3>
        <h4><a href="https://vozliving.slack.com" target="_blank" style="color: white;">
          Đã tham gia ? ghé vô chém gió (tab mới)
        </a></h4>
      </div>
    `);
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
