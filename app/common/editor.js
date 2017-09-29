export function insertTextIntoEditor(text, $editor, position = {}) {
  const value = $editor.val();
  const {
    start = $editor.prop('selectionStart'),
    end = $editor.prop('selectionEnd'),
  } = position;

  const textBefore = value.substring(0, start);
  const textAfter = value.substring(end, value.length);

  $editor.val(textBefore + text + textAfter);
  $editor[0].setSelectionRange(
    start + text.length, start + text.length);
  $editor.focus();
  return { start, end: end + text.length };
}
