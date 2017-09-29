export default function openNewTab(href) {
  const a = document.createElement('a');
  a.href = href;
  const evt = new MouseEvent('click', {
    canBubble: true,
    cancelable: true,
    view: window,
    ctrlKey: true,
    metaKey: true,
  });
  a.dispatchEvent(evt);
  return false;
}
