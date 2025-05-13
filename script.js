const pin = document.getElementById('pin');
const textBlock = document.getElementById('text-block');

let isDragging = false;
let offsetX = 0, offsetY = 0;

function startDrag(e) {
isDragging = true;

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

const bounds = textBlock.getBoundingClientRect();
const clientX = e.touches ? e.touches[0].clientX : e.clientX;
const clientY = e.touches ? e.touches[0].clientY : e.clientY;

let newLeft = clientX - bounds.left - offsetX;
let newTop = clientY - bounds.top - offsetY;

newLeft = Math.max(0, Math.min(bounds.width - pin.offsetWidth, newLeft));
newTop = Math.max(0, Math.min(bounds.height - pin.offsetHeight, newTop));

pin.style.position = 'absolute';
pin.style.left = `${newLeft}px`;
pin.style.top = `${newTop}px`;
pin.style.transition = 'none';

if (e.cancelable) e.preventDefault();
  }

function stopDrag(e) {
if (!isDragging) return;
isDragging = false;

document.body.style.overflow = '';
document.body.style.touchAction = '';

pin.style.transition = 'top 0.5s ease-out';

if (e.cancelable) e.preventDefault();
  }

pin.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', onDrag);
document.addEventListener('mouseup', stopDrag);

pin.addEventListener('touchstart', startDrag, { passive: false });
document.addEventListener('touchmove', onDrag, { passive: false });
document.addEventListener('touchend', stopDrag);
