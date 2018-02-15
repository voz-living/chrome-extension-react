export function insertTextIntoEditor(text, $editor, position = {}, curOffsetStart = 0, curOffsetEnd = 0) {
  const value = $editor.val();
  const {
    start = $editor.prop('selectionStart'),
    end = $editor.prop('selectionEnd'),
  } = position;

  const textBefore = value.substring(0, start);
  const textAfter = value.substring(end, value.length);

  $editor.val(textBefore + text + textAfter);
  $editor.focus();
  $editor[0].setSelectionRange(
    start + text.length + curOffsetStart, start + text.length + curOffsetEnd);
  return { start, end: end + text.length };
}
