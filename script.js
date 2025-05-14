document.addEventListener("DOMContentLoaded", function() {
  const bold = "Documents in Huly";
  const rest = " can be used for sharing reference materials among team members, collaborating on plans and roadmaps, storing meeting notes and assigning action items.";
  const out = document.getElementById("typing-text");
  const highlight = document.getElementById("highlight-overlay");
  const cursor = document.getElementById("cursor-overlay");
  const hulyContainer = document.getElementById("huly-container");

  if (!out || !highlight || !cursor || !hulyContainer) {
    console.error("One or more required elements are missing. Please check your HTML.");
    return;
  }

  let done = false;

  function typeIt() {
    let i = 0;
    (function step() {
      if (i <= bold.length + rest.length) {
        if (i <= bold.length) {
          out.innerHTML = `<span class="font-semibold">${bold.slice(0, i)}</span>`;
        } else {
          out.innerHTML = `<span class="font-semibold">${bold}</span>${rest.slice(0, i - bold.length)}`;
        }
        i++;
        setTimeout(step, 20);
      } else {
        highlight.classList.remove("opacity-0");
        cursor.classList.remove("opacity-0");
      }
    })();
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !done) {
        done = true;
        setTimeout(typeIt, 500);
        obs.disconnect();
      }
    });
  }, { threshold: 0.5 });

  obs.observe(hulyContainer);
});
