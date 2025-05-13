const pin       = document.getElementById('pin');
const sectionEl = document.getElementById('metabrain');

let isDragging = false, offsetX, offsetY;

pin.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', onDrag);
document.addEventListener('mouseup',   stopDrag);

pin.addEventListener('touchstart', startDrag, { passive:false });
document.addEventListener('touchmove',  onDrag,   { passive:false });
document.addEventListener('touchend',   stopDrag);

function startDrag(e) {
  isDragging = true;
  document.body.style.overflow = 'hidden';
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

  const secRect = sectionEl.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  // raw new coords
  let newLeft = clientX - offsetX;
  let newTop  = clientY - offsetY;

  // clamp inside section (no extra margin):
  const minX = secRect.left;
  const maxX = secRect.right - pin.offsetWidth;
  const minY = secRect.top;
  const maxY = secRect.bottom - pin.offsetHeight;

  newLeft = Math.max(minX, Math.min(maxX, newLeft));
  newTop  = Math.max(minY, Math.min(maxY, newTop));

  // set relative to section container
  pin.style.position = 'absolute';
  pin.style.left     = `${newLeft - secRect.left}px`;
  pin.style.top      = `${newTop  - secRect.top }px`;
  pin.style.transition = 'none';

  if (e.cancelable) e.preventDefault();
}

function stopDrag(e) {
  if (!isDragging) return;
  isDragging = false;

  document.body.style.overflow   = '';
  document.body.style.touchAction= '';

  // drop‐down animation:
  const dropY = Math.min(
    pin.offsetTop + 50,
    sectionEl.clientHeight - pin.offsetHeight
  );
  pin.style.transition = 'top 1s cubic-bezier(0.25,0.46,0.45,0.94)';
  pin.style.top        = `${dropY}px`;

  if (e?.cancelable) e.preventDefault();
}
