document.addEventListener('DOMContentLoaded', () => {
  const editor       = document.getElementById('editor');
  const hlOverlay    = document.getElementById('highlight-overlay');
  const cuOverlay    = document.getElementById('cursor-overlay');
  const btnLink      = document.getElementById('btn-link');
  const btnBold      = document.getElementById('btn-bold');
  const btnItalic    = document.getElementById('btn-italic');
  const btnUnderline = document.getElementById('btn-underline');
  const btnStrike    = document.getElementById('btn-strike');
  const btnHighlight = document.getElementById('btn-highlight');
  let manualToggle = false;

  // --- Formatting buttons ---
  const exec = (cmd, arg = null) => {
    document.execCommand(cmd, false, arg);
    editor.focus();
  };

  btnBold.addEventListener('click',   () => exec('bold'));
  btnItalic.addEventListener('click', () => exec('italic'));
  btnUnderline.addEventListener('click', () => exec('underline'));
  btnStrike.addEventListener('click', () => exec('strikeThrough'));
  btnLink.addEventListener('click', () => {
    const url = prompt('Enter URL:', 'https://');
    if (url) exec('createLink', url);
  });

  // --- Highlight toggle function ---
  function setHighlight(on) {
    if (on) {
      hlOverlay.style.setProperty('--highlight-position', 1);
      hlOverlay.classList.remove('opacity-0');
      cuOverlay.classList.remove('opacity-0');
      editor.classList.replace('text-white', 'text-black');
    } else {
      hlOverlay.classList.add('opacity-0');
      cuOverlay.classList.add('opacity-0');
      editor.classList.replace('text-black', 'text-white');
    }
  }

  btnHighlight.addEventListener('click', () => {
    manualToggle = true;
    const isOn = !hlOverlay.classList.contains('opacity-0');
    setHighlight(!isOn);
  });

  // --- Auto-show highlight on scroll 50% ---
  const obs = new IntersectionObserver((entries) => {
    for (let e of entries) {
      if (e.isIntersecting && !manualToggle) {
        setHighlight(true);
        obs.disconnect();
      }
    }
  }, { threshold: 0.5 });

  obs.observe(document.getElementById('editor-container'));
});
