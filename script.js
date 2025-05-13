const editor = document.getElementById('editor');

  document.getElementById('boldBtn').addEventListener('click', () => {
    document.execCommand('bold', false, null);
    editor.focus();
  });

  document.getElementById('italicBtn').addEventListener('click', () => {
    document.execCommand('italic', false, null);
    editor.focus();
  });

  document.getElementById('underlineBtn').addEventListener('click', () => {
    document.execCommand('underline', false, null);
    editor.focus();
  });

  document.getElementById('strikeBtn').addEventListener('click', () => {
    document.execCommand('strikeThrough', false, null);
    editor.focus();
  });

  document.getElementById('linkBtn').addEventListener('click', () => {
    const url = prompt('Enter the URL:', 'https://');
    if (url) document.execCommand('createLink', false, url);
    editor.focus();
  });

  document.getElementById('upBtn').addEventListener('click', () => {
    editor.focus();
    document.execCommand('selectAll', false, null);
  });

  document.getElementById('downBtn').addEventListener('click', () => {
    editor.focus();
    document.execCommand('selectAll', false, null);
  });
