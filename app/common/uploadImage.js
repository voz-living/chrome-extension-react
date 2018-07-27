import {
  POST,
} from '../utils/http';
import $ from 'jquery';

export function uploadImageToPikVn(imageData) {
  const url = 'http://2.pik.vn/';
  // const formData = new FormData();
  // formData.append('image', imageData);

  /* eslint-disable new-cap */
  return new Promise((resolve, reject) => {
    $.ajax(url, {
      method: 'POST',
      data: { image: imageData },
      xhrFields: {
        withCredentials: true,
      },
      dataType: 'json',
    })
    .done((data, status) => {
      const image = data.saved;
      if (image) {
        resolve({ url: url + image });
      } else {
        resolve({});
      }
    })
    .fail((xhr, status, error) => reject(error));
  });
  // return POST(url, {
  //   body: formData,
  //   mode: 'no-cors',
  //   jsonOutput: true,
  // }).then(res => {
  //   console.log(res);
  //   return res.saved;
  // }).catch(e => console.log(e));
}

export function uploadImageToImgur(imageData, showProgress = false) {
  const candy = '11f712f3240e20c';
  const form = new FormData();
  let newWindow;
  let number;
  let key;
  form.append('image', imageData.replace(/^data:image\/\w{2,4};base64,/i, ''));
  const settings = {
    async: true,
    crossDomain: true,
    url: 'https://api.imgur.com/3/image',
    method: 'POST',
    headers: {
      Authorization: `Client-ID ${candy}`,
    },
    processData: false,
    contentType: false,
    mimeType: 'multipart/form-data',
    data: form,
  };
  if (showProgress) {
    settings.xhr = () => {
      key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
      const xhr = new window.XMLHttpRequest();
      newWindow = window.open('', 'voz-living-bar', 'height=150,width=250,left=0,top=200');
      const body = newWindow.document.body;
      body.innerHTML += `<div id="${key}" class="undone">
<progress value="0" max="100" style="width:200px"></progress><div>0%</div></div>`;
      body.scrollTop = body.scrollHeight;
      const bar = newWindow.document.querySelector(`#${key} progress`);
      number = newWindow.document.querySelector(`#${key} div`);
      xhr.upload.addEventListener('progress', evt => {
        if (evt.lengthComputable) {
          let percentComplete = evt.loaded / evt.total;
          percentComplete = parseInt(percentComplete * 100, 10);
          bar.value = percentComplete;
          number.innerHTML = `${percentComplete}%`;
          if (percentComplete === 100) number.innerHTML = 'Xong. Chờ upload hình ảnh...';
        }
      }, false);
      return xhr;
    };
  }
  return new Promise((resolve, reject) => {
    $.ajax(settings).done((response) => {
      if (showProgress) {
        newWindow.document.getElementById(key).className = 'done';
        number.innerHTML = 'Xong.';
        setTimeout(() => { // await queries
          if (newWindow.document.getElementsByClassName('undone').length <= 0) newWindow.close();
        }, 1000);
      }
      const parsed = JSON.parse(response);
      const image = parsed.data.link;
      resolve({ url: image });
    })
      .fail((xhr, status, error) => reject(error));
  });
}

export function uploadImage(imageData, showProgress) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ service: 'image-upload', imageData, showProgress }, (response) => {
      resolve(response);
    });
  });
}
