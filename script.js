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
        border: 3px solid rgba(255, 255, 255, 0.95);
        box-shadow: 0 25px 45px -12px rgba(0, 0, 0, 0.5),
                    0 5px 15px -5px rgba(0, 0, 0, 0.3),
                    0 0 0 2px rgba(79, 158, 255, 0.2) inset;
        transition: all 0.3s ease;
      `;
    } else {
      lightboxImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 12px;
        box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.4),
                    0 0 0 1px rgba(79, 158, 255, 0.15) inset;
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

  // --- 8. Theme Toggle (Dark/Light Mode) with localStorage persistence ---
  const themeToggle = document.getElementById('theme-btn');
  const htmlElement = document.documentElement;

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // --- 9. Fade-in on scroll using Intersection Observer (disable on small screens) ---
  const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
  
  if (!isSmallScreen) {
    const fadeElements = document.querySelectorAll('.project-item, .section, .journal-entry');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => observer.observe(el));
  } else {
    // Immediately show all elements on small screens
    document.querySelectorAll('.project-item, .section, .journal-entry').forEach(el => {
      el.classList.add('fade-in');
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }

  // --- 10. Interactive Grid Background ---
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

  // --- 11. Journal teaser modal ---
  const journalTeaser = document.querySelector('.journal-teaser');
  const journalModal = document.getElementById('journal-preview-modal');
  if (journalTeaser && journalModal) {
    journalTeaser.style.cursor = 'pointer';
    journalTeaser.addEventListener('click', (e) => {
      if (e.target.closest('.btn-view')) return;
      journalModal.classList.add('active');
    });
    journalModal.addEventListener('click', (e) => {
      if (e.target === journalModal) {
        journalModal.classList.remove('active');
      }
    });
  }

  // --- 12. Show Scratch Card when GitHub link is clicked ---
  const githubTriggers = document.querySelectorAll('#github-choice-trigger');
  const scratchCardOverlay = document.getElementById('scratch-card-wrapper');
  const scratchAudioGlobal = document.getElementById('scratch-sound');

  if (githubTriggers.length && scratchCardOverlay) {
    githubTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        scratchCardOverlay.classList.add('active');
        setTimeout(() => {
          initScratchCard();
        }, 100);
      });
    });

    scratchCardOverlay.addEventListener('click', (e) => {
      if (e.target === scratchCardOverlay) {
        scratchCardOverlay.classList.remove('active');
        if (scratchAudioGlobal) {
          scratchAudioGlobal.pause();
          scratchAudioGlobal.currentTime = 0;
        }
        const rewardAudio = document.getElementById('reward-sound');
        if (rewardAudio) {
          rewardAudio.pause();
          rewardAudio.currentTime = 0;
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && scratchCardOverlay.classList.contains('active')) {
        scratchCardOverlay.classList.remove('active');
        if (scratchAudioGlobal) {
          scratchAudioGlobal.pause();
          scratchAudioGlobal.currentTime = 0;
        }
        const rewardAudio = document.getElementById('reward-sound');
        if (rewardAudio) {
          rewardAudio.pause();
          rewardAudio.currentTime = 0;
        }
      }
    });
  }

  // --- 13. Scratch Card Canvas Initialization with Sound ---
  let scratchCtx = null;
  let scratchCardElement = null;
  let scratchCanvasElement = null;
  let isScratchCompleted = false;
  let lastX = 0, lastY = 0;
  let isFirstMove = true;
  const SCRATCH_THRESHOLD = 0.75;
  const BRUSH_SIZE = 32;
  
  const scratchAudio = document.getElementById('scratch-sound');
  if (scratchAudio) {
    scratchAudio.volume = 0.25;
  }
  
  let lastPlayTime = 0;
  const SOUND_INTERVAL = 450;

  function initScratchCard() {
    scratchCardElement = document.getElementById("interactive-card");
    scratchCanvasElement = document.getElementById("scratch-canvas");
    
    if (!scratchCardElement || !scratchCanvasElement) return;
    
    isScratchCompleted = false;
    isFirstMove = true;
    
    scratchCanvasElement.width = scratchCardElement.offsetWidth;
    scratchCanvasElement.height = scratchCardElement.offsetHeight;
    
    scratchCtx = scratchCanvasElement.getContext("2d");
    scratchCtx.fillStyle = "#16191b";
    scratchCtx.fillRect(0, 0, scratchCanvasElement.width, scratchCanvasElement.height);
    
    for (let i = 0; i < scratchCanvasElement.width; i += 2) {
      let n = Math.floor(Math.random() * 12);
      scratchCtx.fillStyle = `rgba(255, 255, 255, ${0.01 + n / 1000})`;
      scratchCtx.fillRect(i, 0, 1, scratchCanvasElement.height);
    }
    
    scratchCanvasElement.classList.remove("is-completed");
    scratchCardElement.style.cursor = "crosshair";
    
    const oldClick = scratchCardElement._scratchClick;
    if (oldClick) scratchCardElement.removeEventListener("click", oldClick);
  }

  function scratch(x, y) {
    if (isScratchCompleted || !scratchCtx) return;
    
    const now = Date.now();
    if (scratchAudio && (now - lastPlayTime) > SOUND_INTERVAL) {
      scratchAudio.currentTime = 0;
      scratchAudio.play().catch(e => console.log('Audio play failed:', e));
      lastPlayTime = now;
    }
    
    scratchCtx.globalCompositeOperation = "destination-out";
    scratchCtx.lineJoin = "round";
    scratchCtx.lineCap = "round";
    scratchCtx.lineWidth = BRUSH_SIZE * 2;
    scratchCtx.beginPath();
    if (isFirstMove) {
      scratchCtx.moveTo(x, y);
      isFirstMove = false;
    } else {
      scratchCtx.moveTo(lastX, lastY);
    }
    scratchCtx.lineTo(x, y);
    scratchCtx.stroke();
    lastX = x;
    lastY = y;
    queuePercentageCheck();
  }

  let checkTimeout;
  function queuePercentageCheck() {
    clearTimeout(checkTimeout);
    checkTimeout = setTimeout(() => {
      if (isScratchCompleted || !scratchCtx) return;
      const imageData = scratchCtx.getImageData(0, 0, scratchCanvasElement.width, scratchCanvasElement.height);
      const pixels = imageData.data;
      let cleared = 0;
      for (let i = 3; i < pixels.length; i += 32) {
        if (pixels[i] === 0) cleared++;
      }
      const currentProgress = cleared / (pixels.length / 32);
      if (currentProgress >= SCRATCH_THRESHOLD) {
        isScratchCompleted = true;
        scratchCanvasElement.classList.add("is-completed");
        scratchCardElement.style.cursor = "pointer";
        
        if (scratchAudio) {
          scratchAudio.pause();
          scratchAudio.currentTime = 0;
        }
        
        const rewardAudio = document.getElementById('reward-sound');
        if (rewardAudio) {
          rewardAudio.volume = 0.5;
          rewardAudio.currentTime = 0;
          rewardAudio.play().catch(e => console.log('Reward audio play failed:', e));
        }
        
        const clickHandler = () => {
          window.open("https://github.com/JackUCS", "_blank");
        };
        scratchCardElement.addEventListener("click", clickHandler);
        scratchCardElement._scratchClick = clickHandler;
      }
    }, 40);
  }

    // Attach mouse/touch handlers to the scratch card with hover flag
  document.addEventListener('mouseover', (e) => {
    const card = e.target.closest('#interactive-card');
    if (!card) return;
    
    if (card.hasScratchHandlers) return;
    card.hasScratchHandlers = true;
    
    let isCardHovered = false;
    
    card.addEventListener("mouseenter", () => {
      isCardHovered = true;
    });
    
    card.addEventListener("mousemove", (e) => {
      if (!isCardHovered) return;  // ← STOPS SCRATCHING WHEN NOT HOVERED
      if (!scratchCardElement || !scratchCanvasElement) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      const cardWidth = rect.width, cardHeight = rect.height;
      const centerX = cardWidth / 2, centerY = cardHeight / 2;
      const maxTilt = 10;
      const tiltX = ((centerY - y) / centerY) * maxTilt;
      const tiltY = ((x - centerX) / centerX) * maxTilt;
      card.style.transition = "none";
      card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      scratch(x, y);
    });

    card.addEventListener("mouseleave", () => {
      isCardHovered = false;      // ← IMMEDIATELY STOPS NEW SCRATCHES
      isFirstMove = true;          // ← RESETS PATH
      lastX = 0;                   // ← PREVENTS ROGUE LINES
      lastY = 0;
      card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "50%");
    });

    card.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const rect = card.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      scratch(x, y);
    }, { passive: false });

    card.addEventListener("touchstart", (e) => {
      const rect = card.getBoundingClientRect();
      lastX = e.touches[0].clientX - rect.left;
      lastY = e.touches[0].clientY - rect.top;
      isFirstMove = false;
    });
    
    // Optional: pointerleave for even faster detection
    card.addEventListener("pointerleave", () => {
      isCardHovered = false;
      isFirstMove = true;
      lastX = 0;
      lastY = 0;
    });
  });
  
  setTimeout(() => {
    if (scratchCardOverlay && scratchCardOverlay.classList.contains('active')) {
      initScratchCard();
    }
  }, 500);

  // --- Hero typing effect for subtitle (reusable) ---
  const subtitleElement = document.getElementById('typed-subtitle');
  if (subtitleElement) {
    const originalText = subtitleElement.innerText; // read the existing text
    subtitleElement.innerHTML = ''; // clear it for typing
    
    // Create spans for text and cursor
    const textSpan = document.createElement('span');
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'typing-cursor';
    cursorSpan.innerHTML = '|';
    subtitleElement.appendChild(textSpan);
    subtitleElement.appendChild(cursorSpan);
    
    let i = 0;
    function typeNext() {
      if (i < originalText.length) {
        textSpan.innerHTML += originalText.charAt(i);
        i++;
        setTimeout(typeNext, 80);
      } else {
        cursorSpan.style.animation = 'blink 1s step-end infinite';
      }
    }
    typeNext();
  }

  console.log("Pro tip: You can reach me via GitHub – links are above.");
});
  // --- Cursor spotlight effect (full site) ---
  const spotlight = document.getElementById('cursor-spotlight');
  if (spotlight) {
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX;
      const y = e.clientY;
      spotlight.style.setProperty('--x', x + 'px');
      spotlight.style.setProperty('--y', y + 'px');
    });
  }