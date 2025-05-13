const pin = document.getElementById('pin');
const textBlock = document.getElementById('text-block');
const header = textBlock.querySelector('h1');
const paragraph = textBlock.querySelector('p');

let isDragging = false;
let offsetX, offsetY;
let typingFinished = false;

// Typing animation function
function typeText(element, text, speed = 40, callback) {
  element.textContent = "";
  let index = 0;
  function typeChar() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(typeChar, speed);
    } else {
      if (callback) callback();
    }
  }
  typeChar();
}

// Observe when text-block enters the viewport
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !typingFinished) {
        typingFinished = true;

        // Save original text
        const headerText = header.textContent;
        const paragraphText = paragraph.textContent;

        // Start typing animation
        typeText(header, headerText, 40, () => {
          typeText(paragraph, paragraphText, 20);
        });
      }
    });
  },
  { threshold: 0.6 }
);

observer.observe(textBlock);

// Dragging events
pin.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', onDrag);
document.addEventListener('mouseup', stopDrag);

pin.addEventListener('touchstart', startDrag, { passive: false });
document.addEventListener('touchmove', onDrag, { passive: false });
document.addEventListener('touchend', stopDrag);

function startDrag(e) {
  if (!typingFinished) return;

  isDragging = true;
  document.body.style.overflow = 'hidden';
  document.body.style.touchAction = 'none';

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

  const margin = -200;

  let newLeft = clientX - offsetX;
  let newTop = clientY - offsetY;

  const minX = textRect.left + o;
  const maxX = textRect.right - pin.offsetWidth + 1;
  const minY = textRect.top + margin;
  const maxY = textRect.bottom - pin.offsetHeight - 100;

  newLeft = Math.max(minX, Math.min(maxX, newLeft));
  newTop = Math.max(minY, Math.min(maxY, newTop));

  pin.style.position = 'absolute';
  pin.style.left = `${newLeft - textRect.left}px`;
  pin.style.top = `${newTop - textRect.top}px`;
  pin.style.transition = 'none';

  if (e.cancelable) e.preventDefault();
}

function stopDrag() {
  if (!isDragging) return;
  isDragging = false;
  document.body.style.overflow = '';
  document.body.style.touchAction = '';

  const finalY = pin.offsetTop + 50;
  const maxDrop = textBlock.offsetHeight - pin.offsetHeight;
  const dropY = Math.min(finalY, maxDrop);

  pin.style.transition = 'top 1s ease-in-out';
  pin.style.top = `${dropY}px`;
}
