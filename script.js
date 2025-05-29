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
    const selection = window.getSelection().toString();
    if (selection === '') {
      alert('Please select some text first.');
      return;
    }
    const success = document.execCommand(cmd, false, arg);
    console.log(`execCommand ${cmd} returned:`, success);
    if (!success) {
      console.warn(`Failed to execute ${cmd}`);
    }
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
      // Wrap words in spans for animation
      wrapWordsInSpans(editor);
      hlOverlay.classList.remove('opacity-0');
      cuOverlay.classList.remove('opacity-0');
      editor.classList.replace('text-white', 'text-black');
    } else {
      // Remove highlight spans
      removeHighlightSpans(editor);
      hlOverlay.classList.add('opacity-0');
      cuOverlay.classList.add('opacity-0');
      editor.classList.replace('text-black', 'text-white');
    }
  }

  function wrapWordsInSpans(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text.trim() === '') return;
      const words = text.split(' ');
      const fragment = document.createDocumentFragment();
      words.forEach((word, index) => {
        if (index > 0) {
          fragment.appendChild(document.createTextNode(' '));
        }
        const span = document.createElement('span');
        span.className = 'highlight-word';
        span.style.animationDelay = `${index * 0.2}s`;
        span.textContent = word;
        fragment.appendChild(span);
      });
      node.parentNode.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (let child of [...node.childNodes]) {
        wrapWordsInSpans(child);
      }
    }
  }

  function removeHighlightSpans(node) {
    if (node.nodeType === Node.ELEMENT_NODE && node.className === 'highlight-word') {
      const parent = node.parentNode;
      const textNode = document.createTextNode(node.textContent);
      parent.replaceChild(textNode, node);
      // Note: This might leave multiple text nodes; merging them is complex and omitted here
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (let child of [...node.childNodes]) {
        removeHighlightSpans(child);
      }
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

//----Drag animation---//
const pin = document.getElementById("pin");
const wrapper = document.getElementById("main-wrapper");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;
const dragLimit = 100; // Maximum drag distance before snapping

const getCenter = (rect) => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

pin.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - pin.offsetLeft;
  offsetY = e.clientY - pin.offsetTop;
  pin.style.transition = "none";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  let newLeft = e.clientX - offsetX;
  let newTop = e.clientY - offsetY;

  const pinCenter = {
    x: newLeft + pin.offsetWidth / 2,
    y: newTop + pin.offsetHeight / 2
  };

  const wrapperCenter = {
    x: wrapper.clientWidth / 2,
    y: wrapper.clientHeight / 2
  };

  const distance = Math.hypot(pinCenter.x - wrapperCenter.x, pinCenter.y - wrapperCenter.y);

  if (distance > dragLimit) {
    snapToNearest(pinCenter);
    isDragging = false;
    return;
  }

  pin.style.left = newLeft + "px";
  pin.style.top = newTop + "px";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  pin.style.transition = "all 0.3s ease";
});

function snapToNearest(center) {
  const w = wrapper.clientWidth;
  const h = wrapper.clientHeight;
  const pinW = pin.offsetWidth;
  const pinH = pin.offsetHeight;

  const distances = {
    left: center.x,
    right: w - center.x,
    top: center.y,
    bottom: h - center.y
  };

  // Remove bottom: treat as top
  if (distances.bottom < distances.top) {
    distances.top = distances.bottom;
  }

  let nearest = Object.keys(distances).reduce((a, b) => distances[a] < distances[b] ? a : b);

  pin.style.transition = "all 0.3s ease";

  switch (nearest) {
    case "left":
      pin.style.left = "30px";
      break;
    case "right":
      pin.style.left = (w - pinW - 30) + "px";
      break;
    case "top":
    case "bottom":
      pin.style.top = "30px";
      break;
  }
}
