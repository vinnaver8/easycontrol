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

    const textRect = textBlock.getBoundingClientRect();
    const pinRect = pin.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Calculate new pin position
    let newLeft = clientX - offsetX;
    let newTop = clientY - offsetY;

    // Clamp X within text block
    const minX = textRect.left - 100;
    const maxX = textRect.right - pin.offsetWidth + 100;
    newLeft = Math.max(minX, Math.min(maxX, newLeft));

    // Clamp Y within text block
    const minY = textRect.top - 100;
    const maxY = textRect.bottom - pin.offsetHeight + 100;
    newTop = Math.max(minY, Math.min(maxY, newTop));

    // Apply position
    pin.style.position = 'absolute';
    pin.style.left = `${newLeft - textRect.left}px`;
    pin.style.top = `${newTop - textRect.top}px`;
    pin.style.transition = 'none';
  }

  function stopDrag() {
    if (!isDragging) return;
    isDragging = false;

    const textRect = textBlock.getBoundingClientRect();
    const finalY = pin.offsetTop + 50; // Drop a bit

    const maxDrop = textBlock.offsetHeight - pin.offsetHeight;
    const dropY = Math.min(finalY, maxDrop);

    pin.style.transition = 'top 1s ease-in-out';
    pin.style.top = `${dropY}px`;
  }
