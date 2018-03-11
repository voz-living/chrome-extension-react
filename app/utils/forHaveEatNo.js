import _ from 'lodash';
export default function forHaveEatNo() {
  const div = document.createElement('div');
  const eatWarn = document.createElement('b');
  div.style.padding = '2px 0';
  div.style.background = '#ff5858';
  div.id = 'cho-an-warning';
  div.appendChild(eatWarn);
  eatWarn.innerHTML = 'Dạo này mod hay kiểm tra từ khoá "ăn" ở f33 thì phải. Thím nhớ đi nhẹ, nói khẽ, cười duyên để không bị ra đảo ngắm khỉ nhé :)';
  function eatNo() {
    const text = this.value;
    if (length && length < 50 && (/(?:[^a-z]|^)eat|(?:[^a-z]|^)(?:ă|Ă)n(?:[^a-z]|$)/i.test(text))) {
      if (!document.getElementById('cho-an-warning')) {
        this.parentElement.appendChild(div);
      }
    } else {
      div.remove();
    }
  }
  const throttled = _.throttle(eatNo, 300); // improve performance
  if (document.getElementById('vB_Editor_QR_textarea')) {
    document.getElementById('vB_Editor_QR_textarea').addEventListener('input', throttled);
  } else if (document.getElementById('vB_Editor_001_textarea')) {
    document.getElementById('vB_Editor_001_textarea').addEventListener('input', throttled);
  }
}
