const pin = document.getElementById('pin');
const textBlock = document.getElementById('text-block');

let isDragging = false;
let offsetX, offsetY;

pin.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', onDrag);
document.addEventListener('mouseup', stopDrag);

pin.addEventListener('touchstart', startDrag, { passive: false });
document.addEventListener('touchmove', onDrag, { passive: false });
document.addEventListener('touchend', stopDrag);

function startDrag(e) {
  isDragging = true;

  // Lock scroll behavior
  document.body.style.overflow = 'hidden';
  document.body.style.touchAction = 'none';

  pin.classList.remove('float-pin');

  const rect = pin.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;

  if (e.cancelable) e.preventDefault();
}

function onDrag(e) {
  if (!isDragging) return;

  const textRect = textBlock.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  let newLeft = clientX - offsetX;
  let newTop = clientY - offsetY;

  const minX = textRect.left - 100;
  const maxX = textRect.right - pin.offsetWidth + 120;
  const minY = textRect.top - 100;
  const maxY = textRect.bottom - pin.offsetHeight + 100;

  newLeft = Math.max(minX, Math.min(maxX, newLeft));
  newTop = Math.max(minY, Math.min(maxY, newTop));

  pin.style.position = 'absolute';
  pin.style.left = `${newLeft - textRect.left}px`;
  pin.style.top = `${newTop - textRect.top}px`;
  pin.style.transition = 'none';

  if (e.cancelable) e.preventDefault();
}

function stopDrag(e) {
  if (!isDragging) return;
  isDragging = false;

  // Re-enable scroll
  document.body.style.overflow = '';
  document.body.style.touchAction = '';

  const dropY = Math.min(pin.offsetTop + 50, textBlock.offsetHeight - pin.offsetHeight);
  pin.style.transition = 'top 1s ease-in-out';
  pin.style.top = `${dropY}px`;

  if (e && e.cancelable) e.preventDefault();
}
