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

function setSessionCookie(request) {
  chrome.cookies.remove({ url: 'https://.vozforums.com/', name: 'vfsessionhash' });
  chrome.cookies.remove({ url: 'https://.vozforums.com/', name: 'vfpassword' });
  const sessHash = request.sessHash;
  const passHash = request.passHash;
  chrome.cookies.set(
    { url: 'https://.vozforums.com/', name: 'vfsessionhash', value: sessHash });
  chrome.cookies.set(
    { url: 'https://.vozforums.com/', name: 'vfpassword', value: passHash });
}

function getSessionCookie(request, sendResponse) {
  chrome.cookies.getAll({ url: 'https://.vozforums.com/' }, oldCookies => {
    let oldSessHash = '';
    const oldSessDir = oldCookies.filter(cookie => cookie.name === 'vfsessionhash')[0];
    if (oldSessDir !== undefined) { oldSessHash = oldSessDir.value; }
    let oldPassHash = '';
    const oldPassDir = oldCookies.filter(cookie => cookie.name === 'vfpassword')[0];
    if (oldPassDir !== undefined) { oldPassHash = oldPassDir.value; }
    chrome.cookies.remove({ url: 'https://.vozforums.com/', name: 'vfsessionhash' });
    chrome.cookies.remove({ url: 'https://.vozforums.com/', name: 'vfpassword' });
    const sToken = $('tr:nth-child(2) > td > form > input[type="hidden"]:nth-child(6)').attr('value');
    const loginForm = new FormData();
    const md5pass = md5(request.password);
    console.log('Initialize verification');
    loginForm.append('do', 'login');
    loginForm.append('vb_login_username', request.username);
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
        if (/STANDARD_REDIRECT/.test(res)) {
          chrome.cookies.getAll({ url: 'https://.vozforums.com/' }, cookies => {
            const sessHash = cookies.filter(cookie => cookie.name === 'vfsessionhash')[0].value;
            const passHash = cookies.filter(cookie => cookie.name === 'vfpassword')[0].value;
            sendResponse({ resolve: { sessHash, passHash } });
          });
        } else {
          sendResponse({ reject: 'Error encountered' });
        }
        setSessionCookie({ sessHash: oldSessHash, passHash: oldPassHash });
      })
      .fail(() => { sendResponse({ reject: 'Error encountered' }); });
  });
}


// function logoutSession() {
//   const sToken = $('tr:nth-child(2) > td > form > input[type="hidden"]:nth-child(6)').attr('value');
//   const logoutForm = new FormData();
//   logoutForm.append('do', 'logout');
//   logoutForm.append('logouthash', sToken);
//   logoutForm.append('securitytoken', sToken);
//   $.ajax({
//     type: 'POST',
//     processData: false,
//     contentType: false,
//     url: 'https://vozforums.com/login.php',
//     data: logoutForm,
//   })
//     .done(res => { console.log(res); })
//     .fail(err => { console.log(`Failed to log out: ${err}`); });
// }

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
          getSessionCookie(request.request, sendResponse);
          return true;
        }
        if (request.service === 'set-session-hash') {
          setSessionCookie(request.request);
          return true;
        }
        // if (request.service === 'request-hotthreads') {
        //   hotThreadsService(request, sendResponse);
        //   return true;
        // }
      }
    });
}
