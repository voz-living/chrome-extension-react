function setAttr(elem) {
  elem.setAttribute('autocomplete', 'off');
  elem.setAttribute('autocorrect', 'off');
  elem.setAttribute('autocapitalize', 'off');
  elem.setAttribute('spellcheck', 'false');
}

export default function InputLagReducer() {
  if (document.getElementById('vB_Editor_QR_textarea')) {
    const elem = document.getElementById('vB_Editor_QR_textarea');
    setAttr(elem);
  } else if (document.getElementById('vB_Editor_001_textarea')) {
    const elem = document.getElementById('vB_Editor_001_textarea');
    setAttr(elem);
  }
}
