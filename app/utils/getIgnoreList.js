import $ from 'jquery';
import { setChromeLocalStore } from '../utils/settings';
export default function getIgnoreList() {
  return new Promise(resolve => {
    $.get('https://vozforums.com/profile.php?do=ignorelist', data => {
      const $elem = $(data).find('#ignorelist a');
      if ($elem.length) {
        const ignoreList = [];
        $elem.each(function f() {
          ignoreList.push($(this).text());
        });
        resolve(ignoreList);
      } else {
        setChromeLocalStore({ ignoreList: [] });
        resolve([]);
      }
    });
  });
}
