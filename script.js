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
  e.preventDefault(); // Prevent scrolling while dragging
  const rect = pin.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;
}

function onDrag(e) {
  if (!isDragging) return;
  e.preventDefault(); // Prevent scrolling while dragging

  const textRect = textBlock.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  let newLeft = clientX - offsetX - textRect.left;
  let newTop = clientY - offsetY - textRect.top;

  const minX = 100; // Prevent dragging beyond the left boundary
  const maxX = textRect.width - pin.offsetWidth + 1; // Prevent dragging beyond the right boundary
  const minY = 100; // Prevent dragging beyond the top boundary
  const maxY = textRect.height - pin.offsetHeight +100; // Prevent dragging beyond the bottom boundary

  newLeft = Math.max(minX, Math.min(maxX, newLeft));
  newTop = Math.max(minY, Math.min(maxY, newTop));

  pin.style.position = 'absolute';
  pin.style.left = `${newLeft}px`;
  pin.style.top = `${newTop}px`;
  pin.style.transition = 'none';
}

function stopDrag() {
  if (!isDragging) return;
  isDragging = false;

  const finalY = pin.offsetTop + 50;
  const maxDrop = textBlock.offsetHeight - pin.offsetHeight;
  const dropY = Math.min(finalY, maxDrop);

  pin.style.transition = 'top 1s ease-in-out';
  pin.style.top = `${dropY}px`;
}
