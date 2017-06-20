const optionalCSS = [];
function injectOptionalCSS(tab) {
  console.log(tab.id);
  chrome.tabs.insertCSS(tab.id, {
    code: optionalCSS.map(e => e.css).join('\n'),
    runAt: 'document_start',
  });
}

function handleWideScreenOptions(settings) {
  if (settings.wideScreen === true) {
    optionalCSS.push({
      name: 'wideScreen',
      css: `.page{
        box-shadow: none;
        width: 100% !important;
        transition: all 0.3s;
        max-width: 5000px !important;
      }`,
    });
  } else {
    do {
      optionalCSS.splice(optionalCSS.findIndex(e => e.name === 'wideScreen'), 1);
    } while (optionalCSS.findIndex(e => e.name === 'wideScreen') > -1);
  }
}
chrome.storage.local.get('settings', (storage) => {
  handleWideScreenOptions(storage.settings);
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (changes.settings) {
    handleWideScreenOptions(changes.settings.newValue);
  }
});

module.exports = {
  optionalCSS,
  injectOptionalCSS,
};
