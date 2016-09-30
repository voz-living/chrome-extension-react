/* eslint-disable import/no-unresolved */
import 'whatwg-fetch';
/* eslint-enable import/no-unresolved */

function requestFactory(requestOption = {}) {
  return (url, additionOption = {}) => new Promise((resolve, reject) => {
    const options = { ...requestOption, ...additionOption };
    fetch(url, options).then((response) => {
      response.text().then(resolve).catch(reject);
    }).catch((err) => {
      reject(err);
    });
  });
}

const GET = requestFactory({
  method: 'get',
  credentials: 'same-origin',
});

const POST = requestFactory({
  method: 'post',
  credentials: 'same-origin',
  headers: new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }),
});

const PUT = requestFactory({
  method: 'put',
  credentials: 'same-origin',
  headers: new Headers({
    'Content-Type': 'application/json',
  }),
});


export {
  GET,
  POST,
  PUT,
};
