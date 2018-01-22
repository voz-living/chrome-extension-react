import { Component, PropTypes } from 'react';
import $ from 'jquery';

class AdsControl extends Component {
  static propTypes = {
    isRemoveAds: PropTypes.bool,
  }

  componentDidMount() {
    document.querySelector('body > div > form').remove();
    $(document.body).append(`<a target="_blank" title="Aura U23 VN" href="https://www.google.com.vn/search?q=u23+vietnam+afc" style="display: block; background-size: cover;
    background-image: url(https://github.com/voz-living/chrome-extension-react/raw/master/assert/banner-u23.png);
    background-position: top center; width: 600px; height: 250px; margin: 0 auto;">
    </a>`);
    if (window.localStorage.getItem('survey_done') !== 'yes') {
      $(document.body).prepend(`
        <style>
        .important-survey {
          background: #188218;
          color: white;
          padding: 5px 2px;
          font-size: 12px;
          font-weight: normal;
          font-family: 'Helvetica neue', 'Roboto', sans-serif;
          text-align: center;
          text-shadow: 0 0 1px rgba(0,0,0, 1);
          position: relative;
        }
        .important-survey a {
          color: #f9f996 !important;  
        }
        .important-survey a.close {
          color: white !important;
          font-size: 11px;
          display: block;
          padding: 2px;
          position: absolute;
          top: 3px;
          right: 3px; 
        }
        </style>
        <div class="important-survey">Bạn muốn VozLiving bản mới nhất trên Firefox, Edge, Mobile, ... ? Góp ý chung ? <a href="https://goo.gl/forms/z7RgIvyfpv2ElZf53" target="_blank">trả lời khảo sát ở đây</a></div>
      `);
      const closeBtn = $('<a href="#" class="close">Đã làm ×</a>');
      $('.important-survey').append(closeBtn);
      closeBtn.click(() => {
        window.localStorage.setItem('survey_done', 'yes');
        $('.important-survey').fadeOut(300);
      });
    }
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
