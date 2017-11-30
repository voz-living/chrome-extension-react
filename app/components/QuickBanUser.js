import {
  Component,
  PropTypes,
} from 'react';
import $ from 'jquery';

export default class QuickBanUser extends Component {

  constructor(props) {
    super(props);
    this.hookBanToUser();
  }

  hookBanToUser() {
    $(".vbmenu_popup[id^='postmenu_']").each(function () {
      const $this = $(this);
      const uid = $this.find("a[href*='member.php']").attr('href').match(/\?u=(\d+)/)[1];
      const uName = $this.siblings('.tborder.voz-postbit').find('.bigusername').text();
      const ignoreRow = $((`<tr> 
        <td class='vbmenu_option vbmenu_option_alink vl-option'>
        <a target='_blank' href='https://vozforums.com/search.php?do=finduser&u=${uid}&starteronly=1' 
        >Find all threads by ${uName}</a>
        </td>
        </tr>
        <tr> 
        <td class='vbmenu_option vbmenu_option_alink vl-option'>
        <a target='_blank' href='https://vozforums.com/profile.php?do=addlist&userlist=ignore&u=${uid}' 
        title='Mở trong tab mới'><i class="fa fa-ban"/>&nbsp;Ignore user này (tab mới)</a>
        </td>
        </tr>`
      ));
      $this.find('table tbody').append(ignoreRow);
      $('.vl-option').hover(function () {
        $(this).removeClass().addClass('vbmenu_hilite vbmenu_option_hilite vl-option');
      }, function () {
        $(this).removeClass().addClass('vbmenu_option vbmenu_option_alink vl-option');
      });
    });
  }

  render() {
    return null;
  }
}
