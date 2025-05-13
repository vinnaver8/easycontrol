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
    pin.classList.remove('float-pin');
    const rect = pin.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
  }

  function onDrag(e) {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    pin.style.left = `${clientX - offsetX}px`;
    pin.style.top = `${clientY - offsetY}px`;
    pin.style.transition = 'none';
  }

  function stopDrag() {
    if (!isDragging) return;
    isDragging = false;

    const pinRect = pin.getBoundingClientRect();
    const textRect = textBlock.getBoundingClientRect();
    const finalY = textRect.top + window.scrollY - pin.offsetHeight - 10;

    pin.style.transition = 'top 1s ease-in-out';
    pin.style.top = `${finalY}px`;
  }
const svg = document.getElementById('indox-svg');
const steps = [
  document.getElementById('step1'),
  document.getElementById('step2'),
  document.getElementById('step3'),
  document.getElementById('step4'),
  document.getElementById('step5'),
];
const typingContainer = document.getElementById('typing-container');
const messageLines = [
  "The AI Toolkit is a collection",
  "of advanced tools and frameworks",
  "to build and deploy AI apps easily."
];

let animating = false;

// Click on SVG — toggle animation
svg.addEventListener('click', (event) => {
  event.stopPropagation(); // prevent click from bubbling to document

  if (animating) {
    resetAnimation();
    return;
  }

  animating = true;

  steps.forEach((step, index) => {
    setTimeout(() => {
      step.classList.add('visible');
      if (index === 3) typeAIText();
    }, index * 800);
  });
});

// Click anywhere else — close animation
document.addEventListener('click', (event) => {
  if (!svg.contains(event.target) && animating) {
    resetAnimation();
  }
});

function resetAnimation() {
  steps.forEach(step => step.classList.remove('visible'));
  typingContainer.innerHTML = '';
  animating = false;
}

function typeAIText() {
  typingContainer.innerHTML = '';
  let lineIndex = 0;
  let charIndex = 0;
  let currentLine = '';
  const typingSpeed = 25;

  function typeChar() {
    if (lineIndex >= messageLines.length) return;

    currentLine += messageLines[lineIndex][charIndex];
    updateLine(currentLine, lineIndex);
    charIndex++;

    if (charIndex >= messageLines[lineIndex].length) {
      lineIndex++;
      charIndex = 0;
      currentLine = '';
      setTimeout(typeChar, typingSpeed * 4);
    } else {
      setTimeout(typeChar, typingSpeed);
    }
  }

  function updateLine(text, index) {
    let tspans = typingContainer.querySelectorAll('tspan');
    if (!tspans[index]) {
      let tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.setAttribute("x", 150);
      tspan.setAttribute("dy", index === 0 ? 0 : "1.3em");
      typingContainer.appendChild(tspan);
    }
    typingContainer.querySelectorAll('tspan')[index].textContent = text;
  }

  typeChar();
}
