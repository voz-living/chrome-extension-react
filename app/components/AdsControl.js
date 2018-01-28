import { Component, PropTypes } from 'react';
import $ from 'jquery';

class AdsControl extends Component {
  static propTypes = {
    isRemoveAds: PropTypes.bool,
  }

  componentDidMount() {
    const toRemove = document.querySelector('body > div > form');
    if (toRemove && toRemove.remove) toRemove.remove();
    // $(document.body).append(`<a target="_blank" title="Aura U23 VN" href="https://www.google.com.vn/search?q=u23+vietnam+afc" style="display: block; background-size: cover;
    // background-image: url(https://github.com/voz-living/chrome-extension-react/raw/master/assert/banner-u23.png);
    // background-position: top center; width: 600px; height: 250px; margin: 0 auto;">
    // </a>`);
    // https://userstyles.org/styles/154630/voz-forums-u23-vietnam-theme
    // if (window.localStorage.getItem('survey_done') !== 'u23vn') {
    //   $(document.body).prepend(`
    //     <style>
    //     .important-survey {
    //       background: #188218;
    //       color: white;
    //       padding: 5px 2px;
    //       font-size: 12px;
    //       font-weight: normal;
    //       font-family: 'Helvetica neue', 'Roboto', sans-serif;
    //       text-align: center;
    //       text-shadow: 0 0 1px rgba(0,0,0, 1);
    //       position: relative;
    //     }
    //     .important-survey a {
    //       color: #f9f996 !important;  
    //     }
    //     .important-survey a.close {
    //       color: white !important;
    //       font-size: 11px;
    //       display: block;
    //       padding: 2px;
    //       position: absolute;
    //       top: 3px;
    //       right: 3px; 
    //     }
    //     </style>
    //     <div class="important-survey">Theme đã được đổi để ăn mừng U23 VN nếu bạn muốn trở về như cũ hãy chỉnh trong setting hoặc <a href="https://vozforums.com/showthread.php?p=135404057#post135404057" target="_blank"> xem hướng dẫn tại đây</a></div>
    //   `);
    //   const closeBtn = $('<a href="#" class="close">OK ×</a>');
    //   $('.important-survey').append(closeBtn);
    //   closeBtn.click(() => {
    //     window.localStorage.setItem('survey_done', 'u23vn');
    //     $('.important-survey').fadeOut(300);
    //   });
    // }
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
