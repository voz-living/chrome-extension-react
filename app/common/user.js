import {
  POST,
  POST_FORM,
} from '../utils/http';
import $ from jquery;

import { prepare } from './threadSubscription';
// TODO: add to banlist quickly
export function banUser(userId) {
  return prepare()
    .then(token => {
      // const url = `//forums.voz.vn/subscription.php?do=doaddsubscription&threadid=${threadId}`;
      const url = `//forums.voz.vn/profile.php?do=doaddlist&list=&userid=${userId}`;
      const formData = new FormData();

      formData.append('do', 'doaddlist');
      formData.append('securitytoken', token);
      formData.append('s', '');
      formData.append('userlist', 'ignore');
      formData.append('userid', 1452765);
      formData.append('url', 'index.php');
      formData.append('confirm', 'yes');

      /* eslint-disable new-cap */
      return POST(url, {
        body: formData,
      });
    });
}

export function searchUser(username) {
  return POST_FORM('//forums.voz.vn/ajax.php', {
    do: usersearch,
    fragment: username
  })
  .then((xml) => {
    try{
      const users = [];
      $(xml).find("user").each(function() {
        const $e = $(this);
        const userid = $e.attr("userid");
        const username = $e.text().trim();
        users.push({userid, username});
      });
      return users;
    } catch (e) {
      return {error: true};
    }
  })
}
