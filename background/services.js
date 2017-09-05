import {
  uploadImageToPikVn,
} from '../app/common/uploadImage';

import {
  GET,
} from '../app/utils/http';

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

        // if (request.service === 'request-hotthreads') {
        //   hotThreadsService(request, sendResponse);
        //   return true;
        // }
      }
    });
}
