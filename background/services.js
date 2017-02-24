import {
  uploadImageToPikVn,
} from '../app/common/uploadImage';

function imageUploadService(request, sendResponse) {
  uploadImageToPikVn(request.imageData).then((res) => {
    sendResponse(res);
  });
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
      }
    });
}
