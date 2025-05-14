document.addEventListener('DOMContentLoaded', () => {
  const editor   = document.getElementById('editor');
  const hl       = document.getElementById('highlight-overlay');
  const cu       = document.getElementById('cursor-overlay');
  const btnLink  = document.getElementById('btn-link');
  const btnBold  = document.getElementById('btn-bold');
  const btnItalic= document.getElementById('btn-italic');
  const btnUnder = document.getElementById('btn-underline');
  const btnStrike= document.getElementById('btn-strike');
  const btnHigh  = document.getElementById('btn-highlight');

  // 1) Formatting actions
  btnBold.addEventListener('click',   () => { document.execCommand('bold');   editor.focus(); });
  btnItalic.addEventListener('click', () => { document.execCommand('italic'); editor.focus(); });
  btnUnder.addEventListener('click',  () => { document.execCommand('underline'); editor.focus(); });
  btnStrike.addEventListener('click', () => { document.execCommand('strikeThrough'); editor.focus(); });
  btnLink.addEventListener('click', () => {
    const url = prompt('URL:', 'https://');
    if(url) { document.execCommand('createLink', false, url); editor.focus(); }
  });

  // 2) Highlight toggle animation
  let manualToggle = false, animating = false;
  function animateHighlight(show) {
    if(animating) return;
    animating = true;
    let pos = show ? 0 : 1, end = show ? 1 : 0;
    const step = () => {
      if((show && pos <= end) || (!show && pos >= end)) {
        hl.style.setProperty('--highlight-position', pos);
        hl.style.opacity = show ? 1 : 0;
        cu.style.opacity = show ? 1 : 0;
        pos += show ? 0.02 : -0.02;
        requestAnimationFrame(step);
      } else {
        animating = false;
      }
    };
    step();
  }
  btnHigh.addEventListener('click', () => {
    manualToggle = true;
    animateHighlight(hl.style.opacity ==  '0');
  });

  // 3) Auto‐show on scroll (only once, unless manually toggled off)
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting && !manualToggle) {
        animateHighlight(true);
        obs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  obs.observe(document.querySelector('#editor'));
});
