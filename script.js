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
const draggableBox = document.getElementById('draggableBox');
const draggableContainer = document.getElementById('draggableContainer');
const snapTargetRow = document.getElementById('snap-target-row');
let isDragging = false;
let offsetX, offsetY; 
function getRect(element) {
return element.getBoundingClientRect();
        }
function snapToTargetRowAndMaintainHorizontalPosition() {
const containerRect = getRect(draggableContainer);
const boxRect = getRect(draggableBox);
if (!snapTargetRow) {
console.error("Snap target row not found.");
return;
    }
const targetRowRect = getRect(snapTargetRow);
const targetY = targetRowRect.top - containerRect.top;
     // The targetX is the current horizontal position, clamped within container bounds
       // We get the current transform X value to maintain it
    const transformMatrix = new WebKitCSSMatrix(window.getComputedStyle(draggableBox).transform);
         let targetX = transformMatrix.m41;
   // Ensure targetX is within the container's horizontal bounds
            targetX = Math.max(0, Math.min(targetX, containerRect.width - boxRect.width));
      // Set the new position using transform for smooth animation
            draggableBox.style.transform = `translate(${targetX}px, ${targetY}px)`;
            draggableBox.style.left = '0px'; // Reset left to 0 as transform handles position
            draggableBox.style.top = '0px';  // Reset top to 0 as transform handles position
        }
        // Mouse events
        draggableBox.addEventListener('mousedown', (e) => {
            isDragging = true;
            draggableBox.classList.add('dragging');

            const boxRect = getRect(draggableBox);
            offsetX = e.clientX - boxRect.left;
            offsetY = e.clientY - boxRect.top;
        });

        draggableContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            // Calculate new position relative to the container
            const containerRect = getRect(draggableContainer);
            let newX = e.clientX - offsetX - containerRect.left;
            let newY = e.clientY - offsetY - containerRect.top;

            // Clamp the position within the container bounds
            const boxRect = getRect(draggableBox);
            newX = Math.max(0, Math.min(newX, containerRect.width - boxRect.width));
            newY = Math.max(0, Math.min(newY, containerRect.height - boxRect.height));

            draggableBox.style.transform = `translate(${newX}px, ${newY}px)`;
        });

        draggableContainer.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                draggableBox.classList.remove('dragging');
                snapToTargetRowAndMaintainHorizontalPosition(); // Call the updated snapping function
            }
        });

        // Touch events for mobile responsiveness
        draggableBox.addEventListener('touchstart', (e) => {
            isDragging = true;
            draggableBox.classList.add('dragging');
            e.preventDefault(); // Prevent scrolling while dragging

            const touch = e.touches[0];
            const boxRect = getRect(draggableBox);
            offsetX = touch.clientX - boxRect.left;
            offsetY = touch.clientY - boxRect.top;
        });

        draggableContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Prevent scrolling while dragging

            const touch = e.touches[0];
            const containerRect = getRect(draggableContainer);
            // FIX: Changed containerContainer.top to containerRect.top
            let newX = touch.clientX - offsetX - containerRect.left;
            let newY = touch.clientY - offsetY - containerRect.top;

            const boxRect = getRect(draggableBox);
            newX = Math.max(0, Math.min(newX, containerRect.width - boxRect.width));
            newY = Math.max(0, Math.min(newY, containerRect.height - boxRect.height));

            draggableBox.style.transform = `translate(${newX}px, ${newY}px)`;
        });

        draggableContainer.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                draggableBox.classList.remove('dragging');
                snapToTargetRowAndMaintainHorizontalPosition(); // Call the updated snapping function
            }
        });

        // Initial snap when the page loads
        window.onload = () => {
            snapToTargetRowAndMaintainHorizontalPosition();
        };

        // Recalculate snap position on window resize
        window.addEventListener('resize', () => {
            snapToTargetRowAndMaintainHorizontalPosition();
        });
