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

export function uploadImageToImgur(imageData) {
  const candy = '11f712f3240e20c';
  const form = new FormData();
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
  return new Promise((resolve, reject) => {
    $.ajax(settings).done((response) => {
      const parsed = JSON.parse(response);
      const image = parsed.data.link;
      resolve({ url: image });
    })
      .fail((xhr, status, error) => reject(error));
  });
}

export function uploadImage(imageData) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ service: 'image-upload', imageData }, (response) => {
      resolve(response);
    });
  });
}
