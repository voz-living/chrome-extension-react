import {
  POST,
  GET,
} from '../utils/http';
import {
  getChromeSyncStore,
  setChromeSyncStore,
} from '../utils/settings';

// https://vozforums.com/subscription.php?do=doaddsubscription&threadid=5818745
// s=&securitytoken=1487662382-dfe61d9fb73adc0688ee1c5d004ef57eb5eb09af&do=doaddsubscription&threadid=5818745&url=http%3A%2F%2Fvozforums.com%2Fshowthread.php%3Ft%3D5818745&emailupdate=0&folderid=0
// s:
// securitytoken:1487662382-dfe61d9fb73adc0688ee1c5d004ef57eb5eb09af
// do:doaddsubscription
// threadid:5818745
// url:http%3A%2F%2Fvozforums.com%2Fshowthread.php%3Ft%3D5818745
// emailupdate:0
// folderid:0


// http://vozforums.com/subscription.php?do=removesubscription&t=5818745

function prepare() {
  return getChromeSyncStore(['authInfo'])
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
      const url = `//vozforums.com/subscription.php?do=doaddsubscription&threadid=${threadId}`;
      const formData = new FormData();

      formData.append('do', 'doaddsubscription');
      formData.append('securitytoken', token);
      formData.append('s', '');
      formData.append('threadid', threadId);
      formData.append('url', `http://vozforums.com/showthread.php?t=${threadId}`);
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
      const url = `//vozforums.com/subscription.php?do=removesubscription&t=${threadId}`;
      return GET(url);
    });
}
