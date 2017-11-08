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
    const length = text.match(/\S+/g).length;
    if ((text.match('ăn') || text.match('eat')) && length < 50) {
      if (!document.getElementById('cho-an-warning')) {
        this.parentElement.insertBefore(div, this);
      }
    } else {
      div.remove();
    }
  }
  if (document.getElementById('vB_Editor_QR_textarea')) {
    document.getElementById('vB_Editor_QR_textarea').addEventListener('input', eatNo);
  } else if (document.getElementById('vB_Editor_001_textarea')) {
    document.getElementById('vB_Editor_001_textarea').addEventListener('input', eatNo);
  }
}
