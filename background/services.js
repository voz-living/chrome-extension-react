import {
  uploadImageToPikVn,
} from '../app/common/uploadImage';

import {
  GET,
} from '../app/utils/http';
import $ from 'jquery';
import md5 from 'md5';

function imageUploadService(request, sendResponse) {
  uploadImageToPikVn(request.imageData).then((res) => {
    sendResponse(res);
  });
}

function proxyService(request, sendResponse) {
  const { url, options } = request;
  GET(url, options)
    .then((res) => sendResponse({ resolve: res }))
    .catch(e => sendResponse({ reject: e }));
}

const apiUrl = 'https://voz-living.appspot.com/query?id=agxzfnZvei1saXZpbmdyFQsSCEFwaVF1ZXJ5GICAgICA5JEKDA&format=json';
const cachedHotThreads = {
  data: {},
  ts: new Date().getTime(),
};

function renewToken() {
  $.ajax({ url: 'https://vozforums.com', type: 'GET', dataType: 'text' }).done(data => {
    const token = data.match(/SECURITYTOKEN = "(.*?)";/);
    return token[1];
  });
}

function getSessionCookie(username, password) {
  const sToken = $('tr:nth-child(2) > td > form > input[type="hidden"]:nth-child(6)').attr('value');
  chrome.cookies.remove({ url: 'https://vozforums.com', name: 'vfsessionhash' });
  const loginForm = new FormData();
  const md5pass = md5(password);
  loginForm.append('do', 'login');
  loginForm.append('vb_login_username', username);
  loginForm.append('vb_login_md5password', md5pass);
  loginForm.append('cookieuser', 1);
  loginForm.append('securitytoken', sToken);
  $.ajax({
    type: 'POST',
    processData: false,
    contentType: false,
    url: 'https://vozforums.com/login.php',
    data: loginForm,
  })
    .done(res => {
      chrome.cookies.get(
        { url: 'https://vozforums.com', name: 'vfsessionhash' }, cookie => console.log(cookie.value));
    })
    .fail(err => { console.log(`Failed to get cookie ${err}`); });
}

function setSessionCookie(hash) {
  chrome.cookies.set(
    { url: 'https://vozforums.com', name: 'vfsessionhash', value: hash });
}

function logoutSession() {
  const sToken = $('tr:nth-child(2) > td > form > input[type="hidden"]:nth-child(6)').attr('value');
  const logoutForm = new FormData();
  logoutForm.append('do', 'logout');
  logoutForm.append('logouthash', sToken);
  logoutForm.append('securitytoken', sToken);
  console.log(sToken);
  $.ajax({
    type: 'POST',
    processData: false,
    contentType: false,
    url: 'https://vozforums.com/login.php',
    data: logoutForm,
  })
    .done(res => { console.log(res); })
    .fail(err => { console.log(`Failed to log out ${err}`); });
}
// function hotThreadsService(request, sendResponse) {
//   if (new Date().getTime() > cachedHotThreads.ts + 20 * 1000) {
//     cachedHotThreads.ts = new Date().getTime();
//     GET(apiUrl, { credentials: 'same-origin' })
//       .then(response => {
//         let stats = response;
//         if (typeof response === 'string') {
//           stats = JSON.parse(response);
//         }
//         cachedHotThreads.data = stats.rows;
//         cachedHotThreads.ts = new Date().getTime();
//         sendResponse(stats.rows);
//       });
//   } else {
//     sendResponse(cachedHotThreads.data);
//   }
// }

export default function startServices() {
  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      console.log(sender.tab ?
        'from a content script:' + sender.tab.url :
        'from the extension');
      if (request.service) {
        if (request.service === 'image-upload') {
          imageUploadService(request, sendResponse);
          return true;
        }
        if (request.service === 'open-options') {
          chrome.runtime.openOptionsPage();
          return true;
        }

        if (request.service === 'proxy') {
          proxyService(request, sendResponse);
          return true;
        }
        if (request.service === 'get-session-hash') {
          getSessionCookie();
          return true;
        }
        if (request.service === 'set-session-hash') {
          setSessionCookie();
          return true;
        }
        // if (request.service === 'request-hotthreads') {
        //   hotThreadsService(request, sendResponse);
        //   return true;
        // }
      }
    });
}
