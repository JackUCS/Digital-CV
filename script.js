// Consolidated script – runs once after DOM is ready
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Mobile nav toggle (simple) ---
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // --- 2. Dynamic copyright year ---
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- 3. Console greeting ---
  console.log(
    "%c👋 Thanks for viewing my CV!\n%cBuilt with HTML, CSS, and a little JavaScript – Jack Jeffery, Computing Student",
    "color: #3b82f6; font-size: 14px; font-weight: bold;",
    "color: #1e2a3e; font-size: 12px;"
  );

  // --- 4. Smooth scroll for anchor links ---
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

  // --- 5. Screenshot/video toggles (preserve original button text) ---
  const toggleButtons = document.querySelectorAll('.toggle-screenshot-btn');
  toggleButtons.forEach(btn => {
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
          btn.textContent = originalText;
        }
      }
    });
  });

  // --- 6. Lightbox for images (headshot + screenshots) ---
  const lightboxModal = document.createElement('div');
  lightboxModal.id = 'lightbox-modal';
  lightboxModal.style.cssText = `
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
  const lightboxImg = document.createElement('img');
  lightboxModal.appendChild(lightboxImg);
  document.body.appendChild(lightboxModal);

  const setLightboxStyle = (isHeadshot) => {
    if (isHeadshot) {
      lightboxImg.style.cssText = `
        width: min(80vh, 80vw);
        height: min(80vh, 80vw);
        object-fit: cover;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      `;
    } else {
      lightboxImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      `;
    }
  };

  lightboxModal.addEventListener('click', () => {
    lightboxModal.style.display = 'none';
    lightboxImg.src = '';
  });

  // Screenshot images (rectangular)
  document.querySelectorAll('.screenshot-container img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxImg.src = img.src;
      setLightboxStyle(false);
      lightboxModal.style.display = 'flex';
    });
  });

  // Profile headshot (circular)
  const headshot = document.querySelector('.headshot');
  if (headshot) {
    headshot.style.cursor = 'pointer';
    headshot.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxImg.src = headshot.src;
      setLightboxStyle(true);
      lightboxModal.style.display = 'flex';
    });
  }

  // --- 7. Modal for project items (CV page) and journal entries (journal page) ---
  // Helper to set up modal for a given selector and modal ID
  function setupExpandableModal(selector, modalId) {
    const modalOverlay = document.getElementById(modalId);
    if (!modalOverlay) return;   // modal not present on this page
    const modalContent = modalOverlay.querySelector('.modal-content');
    if (!modalContent) return;

    // Close modal when clicking overlay background
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        setTimeout(() => { modalContent.innerHTML = ''; }, 300);
      }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
        setTimeout(() => { modalContent.innerHTML = ''; }, 300);
      }
    });

    // Attach click to each target element
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', (e) => {
        // Don't trigger if clicking inside a button or link
        if (e.target.closest('.btn-view, .btn-download, a, button')) return;

        const clone = el.cloneNode(true);
        clone.removeAttribute('id');
        clone.style.cursor = 'default';
        clone.style.margin = '0';
        clone.style.padding = '0';
        clone.classList.add('modal-clone');

        modalContent.innerHTML = '';
        modalContent.appendChild(clone);
        modalOverlay.classList.add('active');
      });
    });
  }

  // Apply to project items (CV page) and journal entries (journal page)
  setupExpandableModal('.project-item', 'project-modal');
  setupExpandableModal('.journal-entry', 'journal-modal');

  // --- Final console hint ---
  console.log("Pro tip: You can reach me via GitHub – links are above.");
});

