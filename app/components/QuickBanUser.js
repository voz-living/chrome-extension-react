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
      const ignoreRow = $((`<tr> 
        <td class='vbmenu_option vbmenu_option_alink'>
        <a target='_blank' href='https://vozforums.com/profile.php?do=addlist&userlist=ignore&u=${uid}' 
        title='Mở trong tab mới'><i class="fa fa-ban"/>&nbsp;Ignore user này (tab mới)</a>
        </td>
        </tr>`
      ));
      $this.find('table tbody').append(ignoreRow);
    });
  }

  render() {
    return null;
  }
}
