const pin        = document.getElementById('pin');
  const textBlock  = document.getElementById('text-block');
  const sectionEl  = document.getElementById('metabrain');

  let isDragging = false;
  let offsetX, offsetY;

  pin.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup',   stopDrag);

  pin.addEventListener('touchstart', startDrag, { passive: false });
  document.addEventListener('touchmove', onDrag,    { passive: false });
  document.addEventListener('touchend',  stopDrag);

  function startDrag(e) {
    isDragging = true;
    // prevent page scroll during drag
    document.body.style.overflow     = 'hidden';
    document.body.style.touchAction  = 'none';
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

    const secRect = sectionEl.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // raw coords
    let newLeft = clientX - offsetX;
    let newTop  = clientY - offsetY;

    // generous margin around section
    const margin = 400;
    const minX = secRect.left   - margin;
    const maxX = secRect.right  - pin.offsetWidth + margin;
    const minY = secRect.top    - margin;
    const maxY = secRect.bottom - pin.offsetHeight + margin;

    // clamp
    newLeft = Math.max(minX, Math.min(maxX, newLeft));
    newTop  = Math.max(minY, Math.min(maxY, newTop));

    // position relative to section
    pin.style.position  = 'absolute';
    pin.style.left      = (newLeft - secRect.left) + 'px';
    pin.style.top       = (newTop  - secRect.top ) + 'px';
    pin.style.transition= 'none';

    if (e.cancelable) e.preventDefault();
  }

  function stopDrag(e) {
    if (!isDragging) return;
    isDragging = false;

    // re-enable scroll
    document.body.style.overflow    = '';
    document.body.style.touchAction = '';

    // drop-down snap
    const dropY   = Math.min(pin.offsetTop + 50, textBlock.offsetHeight - pin.offsetHeight);
    pin.style.transition = 'top 1s ease-in-out';
    pin.style.top        = dropY + 'px';

    if (e.cancelable) e.preventDefault();
  }
