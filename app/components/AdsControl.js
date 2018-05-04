import { getLocalSettings } from '../utils/settings';
import $ from 'jquery';

function removeAds() {
    $('head').append(`<style>[id^=div-gpt-ad],[id^=google_ads_div],.middleads,[id^=ads_zone], tbody > tr > td:nth-child(2)[width="160"]{
  display: none}
}</style>`);
  if ($('.middleads+table > tbody > tr > td:eq(1) [id^=div-gpt-ad]').length > 0) {
    $('.middleads+table > tbody > tr > td:eq(1)').remove();
  }
  if ($('link[href$="migrate.min.css"]').length) {
    $('link[href$="migrate.min.css"]').remove();
    require('../styles/hide-voz-migration.less');
  }
  $('.middleads+div > table > tbody > tr > td:eq(1)').remove();
  $('[id^=div-gpt-ad], [id^=google_ads_div], .middleads').hide();
}

export function AdsControl() {
    // const toRemove = document.querySelector('body > div > form');
    // if (toRemove && toRemove.remove) toRemove.remove();

    // https://userstyles.org/styles/154630/voz-forums-u23-vietnam-theme
  if (window.localStorage.getItem('survey_done') !== 'fixMigration') {
    setTimeout(() => {
    $(document.body).prepend(`
        <style>
        .important-survey {
          background: #000;
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
        <div class="important-survey"><a target="_blank">Phiên bản mới: Sửa lỗi migrate voz: vozforums cập nhật tính năng migrate - chuyển bài sang Next Voz khiến Voz Living bị lỗi style => Voz Living sẽ xoá nút migrate này ở mọi thread để tránh xung đột).
        <br />Thêm tính năng hiện ngày lập thread(bật trong settings), cải tiến bộ lọc thread, bug fixes,...</a></div>
      `);
    const closeBtn = $('<a href="#" class="close">OK ×</a>');
    $('.important-survey').append(closeBtn);
    closeBtn.click(() => {
      window.localStorage.setItem('survey_done', 'fixMigration');
      $('.important-survey').fadeOut(300);
    });
    }, 300);
  }

  let isRemoved = false;
  if (localStorage.getItem('adsRemove') === 'true') {
    setTimeout(() => {
      removeAds();
    }, 50);
    isRemoved = true;
  }

  getLocalSettings()
      .then((settings) => {
        if (settings.adsRemove === true && !isRemoved) {
          removeAds();
        }
        localStorage.setItem('adsRemove', settings.adsRemove === true ? 'true' : 'false');
      });
}

