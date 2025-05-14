document.addEventListener('DOMContentLoaded', () => {
const container = document.getElementById('huly-container');
const hl      = document.getElementById('highlight-overlay');
const cu      = document.getElementById('cursor-overlay');
const btn     = document.getElementById('highlightBtn');
let   manual  = false;
btn.addEventListener('click', () => {
manual = true;
hl.classList.toggle('opacity-0');
cu.classList.toggle('opacity-0');
});
const obs = new IntersectionObserver((entries) => {
entries.forEach(e => {
if (e.isIntersecting && !manual) {
hl.classList.remove('opacity-0');
cu.classList.remove('opacity-0');
}
});
}, { threshold: 0.5 });

obs.observe(container);
});
