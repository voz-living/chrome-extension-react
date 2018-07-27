import {
  POST,
  GET,
} from '../utils/http';
import {
  getChromeLocalStore,
  setChromeLocalStore,
} from '../utils/settings';

export function prepare() {
  return getChromeLocalStore(['authInfo'])
    .then(({
      authInfo
    }) => {
      const {
        isLogin,
        token
      } = authInfo;
      if (!isLogin) {
        alert('You need to login to perform this action');
      }
      return token;
    })
    .catch(e => console.error(e));
}

export function subscribeThread(threadId) {
  return prepare()
    .then(token => {
      const url = `//forums.voz.vn/subscription.php?do=doaddsubscription&threadid=${threadId}`;
      const formData = new FormData();

      formData.append('do', 'doaddsubscription');
      formData.append('securitytoken', token);
      formData.append('s', '');
      formData.append('threadid', threadId);
      formData.append('url', `http://forums.voz.vn/showthread.php?t=${threadId}`);
      formData.append('emailupdate', 0);
      formData.append('folderid', 0);

      /* eslint-disable new-cap */
      return POST(url, {
        body: formData,
      });
    });
}

export function unsubscribeThread(threadId) {
  return prepare()
    .then(() => {
      const url = `//forums.voz.vn/subscription.php?do=removesubscription&t=${threadId}`;
      return GET(url);
    });
}
