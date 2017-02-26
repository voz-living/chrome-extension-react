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
      }
    });
}
