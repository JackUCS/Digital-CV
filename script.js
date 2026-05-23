// script.js – lightweight enhancements for Jack Jeffery's CV

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

  // 4. Optional: Add a tiny "copy email" if you ever add email – not needed now.
  //    Instead, just a passive console log to show you're JS-aware.
  console.log("Pro tip: You can reach me via GitHub – links are above.");
});