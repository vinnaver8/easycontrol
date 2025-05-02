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

svg.addEventListener('click', () => {
  if (animating) {
    steps.forEach(step => step.classList.remove('visible'));
    typingContainer.innerHTML = '';
    animating = false;
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
