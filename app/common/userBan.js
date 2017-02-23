import {
  POST,
} from '../utils/http';

import { prepare } from './threadSubscription';
// TODO: add to banlist quickly
export function banUser(userId) {
  return prepare()
    .then(token => {
      // const url = `//vozforums.com/subscription.php?do=doaddsubscription&threadid=${threadId}`;
      const url = `//vozforums.com/profile.php?do=doaddlist&list=&userid=${userId}`;
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
