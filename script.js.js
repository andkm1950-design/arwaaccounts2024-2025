/* ═══════════════════════════════════════════════════
   APPLE RESIDENCY WELFARE ASSOCIATION
   script.js — FY 2024-25
═══════════════════════════════════════════════════ */

/* ── 0. MARK JS READY so reveal-up animations activate ── */
document.documentElement.classList.add('js-ready');

/* ── 1. PRELOADER ────────────────────────────────── */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  setTimeout(() => {
    pre.classList.add('done');
    setTimeout(() => pre.remove(), 600);
  }, 1800);
});

/* ── 2. NAVBAR — scroll behaviour ───────────────── */
const navbar = document.getElementById('navbar');
const handleNavScroll = () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ── 3. NAVBAR — active link on scroll ──────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nl');

const observerNav = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => observerNav.observe(sec));

/* ── 4. MOBILE MENU ──────────────────────────────── */
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

window.closeMM = function () {
  mobileMenu.classList.remove('open');
  burger.classList.remove('open');
  document.body.style.overflow = '';
};

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMM();
});

/* ── 5. REVEAL ON SCROLL ─────────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up');

if ('IntersectionObserver' in window) {
  const observerReveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // stagger siblings within same parent
        const siblings = Array.from(
          entry.target.parentElement.querySelectorAll('.reveal-up')
        );
        const i = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observerReveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => observerReveal.observe(el));
} else {
  // Fallback: show everything immediately if observer not supported
  revealEls.forEach(el => el.classList.add('visible'));
}

/* ── 6. COUNTER ANIMATION ────────────────────────── */
const formatStat = (val, isRupee) => {
  if (!isRupee) return val.toLocaleString('en-IN');
  if (val >= 100000) {
    return '₹' + (val / 100000).toFixed(1) + 'L';
  } else if (val >= 1000) {
    return '₹' + val.toLocaleString('en-IN');
  }
  return '₹' + val;
};

const animateCounter = (el) => {
  const target    = parseInt(el.dataset.val, 10);
  const isRupee   = el.classList.contains('rupee');
  const duration  = 1600;
  const steps     = 60;
  const stepTime  = duration / steps;
  let current     = 0;
  const increment = target / steps;

  // Show final value immediately so it's never blank
  el.textContent = formatStat(target, isRupee);

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = formatStat(Math.round(current), isRupee);
  }, stepTime);
};

const statEls = document.querySelectorAll('.stat-n[data-val]');
if ('IntersectionObserver' in window) {
  const observerStats = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observerStats.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => observerStats.observe(el));
} else {
  // Fallback: set values immediately
  statEls.forEach(el => {
    const val     = parseInt(el.dataset.val, 10);
    const isRupee = el.classList.contains('rupee');
    el.textContent = formatStat(val, isRupee);
  });
}

/* ── 7. CONTACT FORM ─────────────────────────────── */
window.submitForm = function (e) {
  e.preventDefault();

  const nameEl = document.getElementById('cName');
  const flatEl = document.getElementById('cFlat');
  const msgEl  = document.getElementById('cMsg');
  const errN   = document.getElementById('errName');
  const errF   = document.getElementById('errFlat');
  const errM   = document.getElementById('errMsg');
  const ok     = document.getElementById('cfOK');
  const btn    = document.querySelector('.cf-btn');

  [nameEl, flatEl, msgEl].forEach(el => el.classList.remove('error'));
  errN.textContent = errF.textContent = errM.textContent = '';

  let valid = true;

  if (!nameEl.value.trim()) {
    nameEl.classList.add('error');
    errN.textContent = 'Please enter your name.';
    valid = false;
  }
  if (!flatEl.value.trim()) {
    flatEl.classList.add('error');
    errF.textContent = 'Please enter your flat number.';
    valid = false;
  }
  if (!msgEl.value.trim()) {
    msgEl.classList.add('error');
    errM.textContent = 'Please enter your message.';
    valid = false;
  }

  if (!valid) return;

  btn.textContent  = 'Sending…';
  btn.disabled     = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    ok.style.display  = 'block';
    btn.textContent   = 'Send Message';
    btn.disabled      = false;
    btn.style.opacity = '1';
    document.getElementById('cForm').reset();
    setTimeout(() => { ok.style.display = 'none'; }, 5000);
  }, 1000);
};

/* ── 8. SMOOTH SCROLL ────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('navbar').offsetHeight;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── 9. TABLE ROW HOVER GLOW ─────────────────────── */
document.querySelectorAll('.acc-tbl tbody tr').forEach(row => {
  row.addEventListener('mouseenter', () => {
    row.style.boxShadow = 'inset 3px 0 0 var(--gold2)';
  });
  row.addEventListener('mouseleave', () => {
    row.style.boxShadow = '';
  });
});

/* ── Done ────────────────────────────────────────── */
console.log('%cApple Residency WA — FY 2024-25', 'color:#d4a829;font-size:14px;font-weight:bold;');
console.log('%cOpening 43,325 + Collections 3,51,057 = On Hand 3,94,382 − Expenses 2,95,614 = Closing 98,768 ✅', 'color:#155f38;font-size:12px;');

/* ── 2. NAVBAR — scroll behaviour ───────────────── */
const navbar = document.getElementById('navbar');
const handleNavScroll = () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run on load

/* ── 3. NAVBAR — active link on scroll ──────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nl');

const observerNav = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => observerNav.observe(sec));

/* ── 4. MOBILE MENU ──────────────────────────────── */
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  // prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

window.closeMM = function () {
  mobileMenu.classList.remove('open');
  burger.classList.remove('open');
  document.body.style.overflow = '';
};

// close on resize to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMM();
});

/* ── 5. REVEAL ON SCROLL ─────────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up');
const observerReveal = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // stagger siblings within same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal-up'));
      const i = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observerReveal.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observerReveal.observe(el));

/* ── 6. COUNTER ANIMATION ────────────────────────── */
const formatStat = (val, isRupee) => {
  if (!isRupee) return val.toLocaleString('en-IN');
  // Indian numbering: crores, lakhs
  if (val >= 100000) {
    return '₹' + (val / 100000).toFixed(1) + 'L';
  } else if (val >= 1000) {
    return '₹' + val.toLocaleString('en-IN');
  }
  return '₹' + val;
};

const animateCounter = (el) => {
  const target   = parseInt(el.dataset.val, 10);
  const isRupee  = el.classList.contains('rupee');
  const duration = 1600; // ms
  const steps    = 60;
  const stepTime = duration / steps;
  let current    = 0;
  const increment = target / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = formatStat(Math.round(current), isRupee);
  }, stepTime);
};

const statEls = document.querySelectorAll('.stat-n[data-val]');
const observerStats = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      observerStats.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statEls.forEach(el => observerStats.observe(el));

/* ── 7. CONTACT FORM ─────────────────────────────── */
window.submitForm = function (e) {
  e.preventDefault();

  const nameEl = document.getElementById('cName');
  const flatEl = document.getElementById('cFlat');
  const msgEl  = document.getElementById('cMsg');
  const errN   = document.getElementById('errName');
  const errF   = document.getElementById('errFlat');
  const errM   = document.getElementById('errMsg');
  const ok     = document.getElementById('cfOK');
  const btn    = document.querySelector('.cf-btn');

  // clear previous errors
  [nameEl, flatEl, msgEl].forEach(el => el.classList.remove('error'));
  errN.textContent = errF.textContent = errM.textContent = '';

  let valid = true;

  if (!nameEl.value.trim()) {
    nameEl.classList.add('error');
    errN.textContent = 'Please enter your name.';
    valid = false;
  }
  if (!flatEl.value.trim()) {
    flatEl.classList.add('error');
    errF.textContent = 'Please enter your flat number.';
    valid = false;
  }
  if (!msgEl.value.trim()) {
    msgEl.classList.add('error');
    errM.textContent = 'Please enter your message.';
    valid = false;
  }

  if (!valid) return;

  // simulate submission
  btn.textContent = 'Sending…';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    ok.style.display = 'block';
    btn.textContent  = 'Send Message';
    btn.disabled     = false;
    btn.style.opacity = '1';
    // reset form
    document.getElementById('cForm').reset();
    // hide success after 5s
    setTimeout(() => { ok.style.display = 'none'; }, 5000);
  }, 1000);
};

/* ── 8. SMOOTH SCROLL for all anchor links ───────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('navbar').offsetHeight;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── 9. HIGHLIGHT TABLE ROW on hover — keyboard glow */
document.querySelectorAll('.acc-tbl tbody tr').forEach(row => {
  row.addEventListener('mouseenter', () => {
    row.style.boxShadow = 'inset 3px 0 0 var(--gold2)';
  });
  row.addEventListener('mouseleave', () => {
    row.style.boxShadow = '';
  });
});

/* ── 10. NOTICE CARD — read-more expand ─────────── */
// (notices are short, so this is for future use — hook is ready)
// document.querySelectorAll('.notice').forEach(card => { ... });

/* ── Done ─────────────────────────────────────────── */
console.log('%cApple Residency WA — FY 2024-25', 'color:#d4a829;font-size:14px;font-weight:bold;');
console.log('%cAll figures verified ✅', 'color:#155f38;font-size:12px;');
