

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic copyright year
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Console greeting for curious recruiters
  console.log(
    "%c👋 Thanks for viewing my CV!\n%cBuilt with HTML, CSS, and a little JavaScript – Jack Jeffery, Computing Student",
    "color: #3b82f6; font-size: 14px; font-weight: bold;",
    "color: #1e2a3e; font-size: 12px;"
  );

  // 3. Smooth scroll for any internal anchor links (if added later)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 4. Toggle screenshot/video visibility – preserving original button text
  const toggleButtons = document.querySelectorAll('.toggle-screenshot-btn');
  toggleButtons.forEach(btn => {
    // Store the original button text (e.g., "▶️ Show video demo")
    const originalText = btn.textContent;
    btn.setAttribute('data-original-text', originalText);

    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetDiv = document.getElementById(targetId);
      if (targetDiv) {
        if (targetDiv.style.display === 'none') {
          targetDiv.style.display = 'block';
          btn.textContent = '❌ Hide content';
        } else {
          targetDiv.style.display = 'none';
          btn.textContent = originalText;  // Restore the exact original text
        }
      }
    });
  });

  // 5. Lightbox / image expand on click (circular for headshot, rectangular for others)
  const modal = document.createElement('div');
  modal.id = 'lightbox-modal';
  modal.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    justify-content: center;
    align-items: center;
    z-index: 9999;
    cursor: pointer;
  `;
  const modalImg = document.createElement('img');
  modal.appendChild(modalImg);
  document.body.appendChild(modal);

  const setModalStyle = (isHeadshot) => {
    if (isHeadshot) {
      modalImg.style.cssText = `
        width: min(80vh, 80vw);
        height: min(80vh, 80vw);
        object-fit: cover;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      `;
    } else {
      modalImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      `;
    }
  };

  modal.addEventListener('click', () => {
    modal.style.display = 'none';
    modalImg.src = '';
  });

  document.querySelectorAll('.screenshot-container img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      modalImg.src = img.src;
      setModalStyle(false);
      modal.style.display = 'flex';
    });
  });

  const headshot = document.querySelector('.headshot');
  if (headshot) {
    headshot.style.cursor = 'pointer';
    headshot.addEventListener('click', (e) => {
      e.stopPropagation();
      modalImg.src = headshot.src;
      setModalStyle(true);
      modal.style.display = 'flex';
    });
  }

  // 6. Final console hint
  console.log("Pro tip: You can reach me via GitHub – links are above.");
});