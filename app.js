// Year in footer
document.getElementById('y').textContent = new Date().getFullYear();

// 1) Icons
// Lucide: create icons from <i data-lucide="..."></i>  [2](https://lucide.dev/guide/packages/lucide)
if (window.lucide) {
  lucide.createIcons();
}

// 2) Dark/Light toggle with persistence
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('amx_theme', theme);

  // Swap icon (sun/moon)
  const iconHolder = toggle.querySelector('.themeToggle__icon');
  iconHolder.innerHTML = theme === 'dark'
    ? '<i data-lucide="moon"></i>'
    : '<i data-lucide="sun"></i>';

  if (window.lucide) lucide.createIcons();
}

(function initTheme() {
  const saved = localStorage.getItem('amx_theme');
  if (saved) return setTheme(saved);

  // Default to user's OS preference when no saved value
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');
})();

toggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
});

// 3) Scroll reveal (IntersectionObserver)
// Intersection Observer lets you run a callback when elements enter/exit the viewport asynchronously. [1](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
const revealEls = document.querySelectorAll('[data-reveal]');

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-in');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// 4) Cleaner contact form (AJAX if data-ajax="true")
// Works well with Formspree endpoint forms.
// Formspree HTML forms submit to action="https://formspree.io/f/{form_id}" method="post". [3](https://formspree.io/)
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

if (form && form.dataset.ajax === "true") {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = "Sending…";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });

      if (res.ok) {
        form.reset();
        statusEl.textContent = "Thanks! We’ll get back to you soon.";
      } else {
        statusEl.textContent = "Couldn’t send right now. Please try again.";
      }
    } catch (err) {
      statusEl.textContent = "Network error. Please try again.";
    }
  });
}

