document.addEventListener('DOMContentLoaded', () => {
  const pin        = document.getElementById('pin');
  const textBlock  = document.getElementById('text-block');
  const header     = textBlock.querySelector('h1');
  const paragraph  = textBlock.querySelector('p');
  
  let isDragging    = false;
  let offsetX       = 0, offsetY = 0;
  let typingStarted = false;

  // hide the text until we animate it
  header.style.visibility    = 'hidden';
  paragraph.style.visibility = 'hidden';
// Before starting typing
pin.style.left = '10px';
pin.style.top = '50%';
  // typing animation function
  function updatePinPositionForEl(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false); // Collapse to the end
  const rect = range.getBoundingClientRect();
  const textBlockRect = textBlock.getBoundingClientRect();
  const pinLeft = rect.left - textBlockRect.left;
  const pinTop = rect.top - textBlockRect.top;
  pin.style.left = `${pinLeft}px`;
  pin.style.top = `${pinTop}px`;
}

function typeText(el, text, speed = 40, cb) {
  el.style.visibility = 'visible';
  el.textContent = '';
  let idx = 0;
  (function typeChar() {
    if (idx < text.length) {
      el.textContent += text[idx++];
      updatePinPositionForEl(el); // Update pin position after each character
      setTimeout(typeChar, speed);
    } else if (cb) {
      cb();
    }
  })();
}

  // trigger typing once #text-block enters viewport
  new IntersectionObserver((entries, obs) => {
    for (let ent of entries) {
      if (ent.isIntersecting && !typingStarted) {
        typingStarted = true;
        const hText = header.textContent;
        const pText = paragraph.textContent;
        typeText(header, hText, 50, () => {
          typeText(paragraph, pText, 25);
        });
        obs.disconnect();
      }
    }
  }, { threshold: 0.5 }).observe(textBlock);

  // -- DRAG HANDLERS --

  function startDrag(e) {
    if (!typingStarted) return;
    isDragging = true;
    document.body.style.overflow = 'auto';
    document.body.style.touchAction = 'none';
    pin.classList.remove('float-pin');
    const rect    = pin.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
    if (e.cancelable) e.preventDefault();
  }

  function onDrag(e) {
    if (!isDragging) return;
    const bounds  = textBlock.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // compute position relative to text-block
    let newLeft = clientX - bounds.left - offsetX;
    let newTop  = clientY - bounds.top  - offsetY;

    // clamp within boundaries
    const padding = 20; 
    const minX = padding;
    const maxX = bounds.width  - pin.offsetWidth  - padding;
    const minY = padding;
    const maxY = bounds.height - pin.offsetHeight - padding;
    const padding = window.innerWidth < 600 ? 10 : 80;
    newLeft = Math.max(minX, Math.min(maxX, newLeft));
    newTop  = Math.max(minY, Math.min(maxY, newTop));

    pin.style.position   = 'absolute';
    pin.style.left       = `${newLeft}px`;
    pin.style.top        = `${newTop}px`;
    pin.style.transition = 'none';

    if (e.cancelable) e.preventDefault();
  }

  function stopDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.overflow    = '';
    document.body.style.touchAction = '';

    // smooth drop-down
    const finalY = pin.offsetTop + 50;
    const dropY  = Math.min(finalY, textBlock.offsetHeight - pin.offsetHeight);
    pin.style.transition = 'top 1s ease-in-out';
    pin.style.top        = `${dropY}px`;

    if (e && e.cancelable) e.preventDefault();
  }

  // attach events
  pin.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup',   stopDrag);

  pin.addEventListener('touchstart', startDrag, { passive: false });
  document.addEventListener('touchmove',  onDrag,    { passive: false });
  document.addEventListener('touchend',   stopDrag);
});
