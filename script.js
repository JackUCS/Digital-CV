document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Mobile nav toggle ---
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
  console.log("%c👋 Thanks for viewing my CV!\n%cBuilt with HTML, CSS, and a little JavaScript – Jack Jeffery, Computing Student",
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

  // --- 5. Screenshot/video toggles with debounce ---
  const toggleButtons = document.querySelectorAll('.toggle-screenshot-btn');
  toggleButtons.forEach(btn => {
    const originalText = btn.textContent;
    btn.setAttribute('data-original-text', originalText);
    let isToggling = false;
    btn.addEventListener('click', () => {
      if (isToggling) return;
      isToggling = true;
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
      setTimeout(() => { isToggling = false; }, 300);
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

  document.querySelectorAll('.screenshot-container img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxImg.src = img.src;
      setLightboxStyle(false);
      lightboxModal.style.display = 'flex';
    });
  });

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

  // --- 7. Expandable modal for project items and journal entries (with debounce) ---
  function setupExpandableModal(selector, modalId) {
    const modalOverlay = document.getElementById(modalId);
    if (!modalOverlay) return;
    const modalContent = modalOverlay.querySelector('.modal-content');
    if (!modalContent) return;

    let isOpening = false;

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        setTimeout(() => { modalContent.innerHTML = ''; }, 300);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
        setTimeout(() => { modalContent.innerHTML = ''; }, 300);
      }
    });

    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', (e) => {
        if (isOpening) return;
        if (e.target.closest('.btn-view, .btn-download, a, button')) return;
        isOpening = true;
        const clone = el.cloneNode(true);
        clone.removeAttribute('id');
        clone.style.cursor = 'default';
        clone.style.margin = '0';
        clone.style.padding = '0';
        clone.classList.add('modal-clone');
        modalContent.innerHTML = '';
        modalContent.appendChild(clone);
        modalOverlay.classList.add('active');
        setTimeout(() => { isOpening = false; }, 500);
      });
    });
  }

  setupExpandableModal('.project-item', 'project-modal');
  setupExpandableModal('.journal-entry', 'journal-modal');

  // --- 8. GitHub interactive image modal (direct, no choice) ---
  const githubTriggers = document.querySelectorAll('#github-choice-trigger');
  const imageModal = document.getElementById('github-image-modal');

  if (githubTriggers.length && imageModal) {
    // Open image modal directly when any GitHub trigger is clicked
    githubTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        imageModal.classList.add('active');
        
        // Attach parallax effect to the wrapper
        const wrapper = imageModal.querySelector('.github-image-wrapper');
        if (wrapper && !imageModal.parallaxEffect) {
          const parallaxEffect = (e) => {
            const rect = imageModal.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) / rect.width;
            const mouseY = (e.clientY - rect.top) / rect.height;
            const tiltX = (mouseY - 0.5) * 30;
            const tiltY = (mouseX - 0.5) * -30;
            wrapper.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
          };
          imageModal.addEventListener('mousemove', parallaxEffect);
          imageModal.parallaxEffect = parallaxEffect;
        }
      });
    });

    // Close modal when clicking overlay
    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) {
        imageModal.classList.remove('active');
        const wrapper = imageModal.querySelector('.github-image-wrapper');
        if (wrapper && imageModal.parallaxEffect) {
          imageModal.removeEventListener('mousemove', imageModal.parallaxEffect);
          delete imageModal.parallaxEffect;
          wrapper.style.transform = '';
        }
      }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && imageModal.classList.contains('active')) {
        imageModal.classList.remove('active');
        const wrapper = imageModal.querySelector('.github-image-wrapper');
        if (wrapper && imageModal.parallaxEffect) {
          imageModal.removeEventListener('mousemove', imageModal.parallaxEffect);
          delete imageModal.parallaxEffect;
          wrapper.style.transform = '';
        }
      }
    });

    // Make the interactive image wrapper clickable to open GitHub
    const interactiveWrapper = document.querySelector('.github-image-wrapper');
    if (interactiveWrapper) {
      interactiveWrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        window.open('https://github.com/JackUCS', '_blank');
        imageModal.classList.remove('active');
        const wrapper = imageModal.querySelector('.github-image-wrapper');
        if (wrapper && imageModal.parallaxEffect) {
          imageModal.removeEventListener('mousemove', imageModal.parallaxEffect);
          delete imageModal.parallaxEffect;
          wrapper.style.transform = '';
        }
      });
    }
  }

  // --- 9. Theme Toggle (Dark/Light Mode) ---
  const themeToggle = document.getElementById('theme-btn');
  const htmlElement = document.documentElement;

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'light');
      } else {
        htmlElement.setAttribute('data-theme', 'dark');
      }
    });
  }

  // --- 10. Fade-in on scroll using Intersection Observer ---
  const fadeElements = document.querySelectorAll('.project-item, .section, .journal-entry');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  
  fadeElements.forEach(el => observer.observe(el));

  console.log("Pro tip: You can reach me via GitHub – links are above.");
});

  // --- 11. Interactive Grid Background ---
  const gridContainer = document.getElementById("grid-bg");
  const blockSize = 60;

  function createGrid() {
    if (!gridContainer) return;
    gridContainer.innerHTML = "";
    const width = window.innerWidth;
    const height = window.innerHeight;
    const columns = Math.ceil(width / blockSize);
    const rows = Math.ceil(height / blockSize);
    const totalBlocks = columns * rows;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < totalBlocks; i++) {
      const block = document.createElement("div");
      block.classList.add("grid-block");
      fragment.appendChild(block);
    }
    gridContainer.appendChild(fragment);
  }

  createGrid();

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      createGrid();
    }, 150);
  });

// Journal teaser modal (optional)
const journalTeaser = document.querySelector('.journal-teaser');
const journalModal = document.getElementById('journal-preview-modal');
if (journalTeaser && journalModal) {
  journalTeaser.style.cursor = 'pointer';
  journalTeaser.addEventListener('click', (e) => {
    if (e.target.closest('.btn-view')) return; // don't open modal if clicking the button
    journalModal.classList.add('active');
  });
  // Close modal on overlay click
  journalModal.addEventListener('click', (e) => {
    if (e.target === journalModal) {
      journalModal.classList.remove('active');
    }
  });
}