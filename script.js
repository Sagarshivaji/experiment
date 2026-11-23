// Sagar Shivaji Portfolio Website JS Logic

/* ==========================================================================
   PAGE LOADER — shown immediately, hidden once the page has fully loaded
   ========================================================================== */
(function initPageLoaderImmediate() {
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.id = 'pageLoader';
  loader.innerHTML = '<div class="page-loader-spinner"></div>';
  document.documentElement.classList.add('is-loading');
  document.body.appendChild(loader);

  const MIN_DISPLAY_MS = 500;
  const startTime = Date.now();

  function hideLoader() {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
    setTimeout(() => {
      loader.classList.add('page-loader-hidden');
      document.documentElement.classList.remove('is-loading');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, remaining);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }
})();

function getStoredTheme() {
  return 'dark';
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', 'dark');
  try {
    localStorage.setItem('sagar_portfolio_theme', 'dark');
  } catch (e) {}
}

function initThemeToggle() {
  applyTheme();
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initCommandPalette();
  initCustomCursor();
  initScrollAnimations();
  initProgressAndHeader();
  initAiWorkflow();
  initWorkTabs();
  initProjectSorting();
  initLightbox();
  initScrollToTop();
  initArtCarousel();
  initFullStoryToggle();

  // Initialize metrics if they exist on the page
  if (document.querySelectorAll('.metric-card').length > 0) {
    initMetricAnimations();
  }
});


/* ==========================================================================
   NAVIGATION ACTIVE TAB STATE
   ========================================================================== */
function initNavigation() {
  const path = window.location.pathname;
  const navLinks = document.querySelectorAll('nav .nav-links a, .mobile-menu a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Check path alignments (root matches '/index.html' or '/')
    const isHomePath = path === '/' || path === '/index.html' || path.endsWith('/');
    const isLinkHome = href === '/' || href === '/index.html';
    
    if (isHomePath && isLinkHome) {
      link.classList.add('active');
    } else if (!isLinkHome && (path.includes(href) || (path.startsWith(href.replace('.html', ''))))) {
      link.classList.add('active');
    } else if (path.includes('/work/') && href === '/work.html') {
      // Keep 'Work' nav item highlighted when inside deep case study directories
      link.classList.add('active');
    } else if (path.includes('/research/') && href === '/research.html') {
      // Keep 'Research' nav item highlighted when inside deep research article directories
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   COMMAND PALETTE (⌘K)
   ========================================================================== */
function initCommandPalette() {
  const overlay = document.getElementById('commandOverlay');
  const input = document.getElementById('commandInput');
  const resultsContainer = document.getElementById('commandResults');
  if (!overlay || !input || !resultsContainer) return;
  
  // Event: Toggle command menu
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openCommand();
    }
  });

  // Close command palette
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeCommand();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeCommand();
    }
  });

  // Filter commands on typing
  input.addEventListener('input', () => {
    const filter = input.value.toLowerCase().trim();
    const items = resultsContainer.querySelectorAll('.command-item');
    let firstVisible = null;

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(filter)) {
        item.style.display = 'flex';
        if (!firstVisible) firstVisible = item;
      } else {
        item.style.display = 'none';
        item.classList.remove('active');
      }
    });

    // Automatically make the first visible item active
    items.forEach(item => item.classList.remove('active'));
    if (firstVisible) {
      firstVisible.classList.add('active');
    }
  });

  // Handle arrow keys and Enter inside results list
  input.addEventListener('keydown', (e) => {
    const items = Array.from(resultsContainer.querySelectorAll('.command-item:not([style*="display: none"])'));
    if (items.length === 0) return;

    let activeIndex = items.findIndex(item => item.classList.contains('active'));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[activeIndex].classList.remove('active');
      activeIndex = (activeIndex + 1) % items.length;
      items[activeIndex].classList.add('active');
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[activeIndex].classList.remove('active');
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      items[activeIndex].classList.add('active');
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const activeItem = items[activeIndex];
      if (activeItem) {
        const action = activeItem.getAttribute('data-action');
        closeCommand();
        window.location.href = action;
      }
    }
  });

  // Click on command item
  resultsContainer.addEventListener('click', (e) => {
    const item = e.target.closest('.command-item');
    if (item) {
      const action = item.getAttribute('data-action');
      closeCommand();
      window.location.href = action;
    }
  });
}

function openCommand() {
  const overlay = document.getElementById('commandOverlay');
  const input = document.getElementById('commandInput');
  overlay.classList.add('active');
  input.value = '';
  
  // Show all items
  const items = overlay.querySelectorAll('.command-item');
  items.forEach((item, index) => {
    item.style.display = 'flex';
    if (index === 0) item.classList.add('active');
    else item.classList.remove('active');
  });

  setTimeout(() => input.focus(), 50);
}

function closeCommand() {
  const overlay = document.getElementById('commandOverlay');
  if (overlay) overlay.classList.remove('active');
}

/* ==========================================================================
   MOBILE NAVIGATION
   ========================================================================== */
function toggleMobileMenu() {
  const overlay = document.getElementById('mobileMenuOverlay');
  const menu = document.getElementById('mobileMenu');
  if (!menu || !overlay) return;
  const isOpen = menu.classList.contains('active');

  if (isOpen) {
    closeMobileMenu();
  } else {
    overlay.classList.add('active');
    menu.classList.add('active');
  }
}

function closeMobileMenu() {
  const overlay = document.getElementById('mobileMenuOverlay');
  const menu = document.getElementById('mobileMenu');
  if (overlay) overlay.classList.remove('active');
  if (menu) menu.classList.remove('active');
}

/* ==========================================================================
   CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  const dot = document.getElementById('customCursorDot');
  if (!cursor || !dot) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  // Track cursor position
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Instant dot movement
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Smooth ring movement using lerp (linear interpolation)
  function animateRing() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Scale cursor on hover of clickable items
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button, .card, .case-card, .command-item, .workflow-step, .theme-toggle');
    if (target) {
      cursor.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('a, button, .card, .case-card, .command-item, .workflow-step, .theme-toggle');
    if (target) {
      cursor.classList.remove('hover');
    }
  });
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================================== */
let globalRevealObserver;

function initScrollAnimations() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  globalRevealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, options);

  triggerRevealCheck();
}

function triggerRevealCheck() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(reveal => {
    // If element is already on screen, reveal it directly
    const rect = reveal.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      reveal.classList.add('visible');
    } else {
      globalRevealObserver.observe(reveal);
    }
  });
}

/* ==========================================================================
   PROGRESS BAR & STICKY NAVBAR
   ========================================================================== */
function updateProgressBar() {
  const progressBar = document.getElementById('progressBar');
  if (!progressBar) return;
  const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollTotal > 0 ? (window.scrollY / scrollTotal) * 100 : 0;
  progressBar.style.width = progress + '%';
}

function initProgressAndHeader() {
  const navbar = document.getElementById('navbar');

  // Set initial reading progress
  updateProgressBar();

  window.addEventListener('scroll', () => {
    // Update reading progress bar
    updateProgressBar();

    // Add scroll style to navbar
    if (navbar) {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Update sticky case study sidebar active states
    updateStickySidebarState();
  });
}

function updateStickySidebarState() {
  const navLinks = document.querySelectorAll('.sticky-nav a, .cs-nav a');
  if (navLinks.length === 0) return;

  const sectionLinks = Array.from(navLinks).filter(link => {
    const href = link.getAttribute('href');
    return href && href.startsWith('#') && href.length > 1;
  });

  if (sectionLinks.length === 0) return;

  const sections = sectionLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length === 0) return;

  let activeSectionId = sections[0].id;
  const scrollPos = window.scrollY + 180;

  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    if (scrollPos >= sectionTop) {
      activeSectionId = section.getAttribute('id');
    }
  });

  sectionLinks.forEach(link => {
    if (link.getAttribute('href') === `#${activeSectionId}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   METRICS COUNT-UP ANIMATION
   ========================================================================== */
let countUpObservers = [];

function initMetricAnimations() {
  const metricCards = document.querySelectorAll('.metric-card');
  if (metricCards.length === 0) return;

  // Clear previous observers
  countUpObservers.forEach(obs => obs.disconnect());
  countUpObservers = [];

  const countUpObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numbers = entry.target.querySelectorAll('.metric-number');
        numbers.forEach(num => animateCountUp(num));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  metricCards.forEach(card => {
    countUpObserver.observe(card);
    countUpObservers.push(countUpObserver);
  });
}

function animateCountUp(element) {
  const target = parseInt(element.getAttribute('data-target'), 10);
  const duration = 1600; // Animation duration in ms
  const frameRate = 1000 / 60; // 60 frames per second
  const totalFrames = Math.round(duration / frameRate);
  let frame = 0;

  const count = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    // Ease-out quad formula
    const easeProgress = progress * (2 - progress);
    const currentValue = Math.floor(easeProgress * target);

    element.textContent = currentValue;

    if (frame >= totalFrames) {
      element.textContent = target;
      clearInterval(count);
    }
  }, frameRate);
}

/* ==========================================================================
   AI WORKFLOW ACCORDION
   ========================================================================== */
function initAiWorkflow() {
  const steps = document.querySelectorAll('.workflow-step');
  const details = document.querySelectorAll('.ai-detail-card');

  steps.forEach(step => {
    step.addEventListener('click', () => {
      const stepIndex = step.getAttribute('data-step');
      const targetDetail = document.getElementById(`detailCard${stepIndex}`);
      if (!targetDetail) return;
      
      const isAlreadyActive = targetDetail.classList.contains('active');

      // Close all active details
      details.forEach(card => card.classList.remove('active'));

      if (!isAlreadyActive) {
        targetDetail.classList.add('active');
        // Smooth scroll details card into view if on mobile
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            targetDetail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 150);
        }
      }
    });
  });
}

/* ==========================================================================
   WORK FILTER TABS (UI/UX Design · Development · Graphic Design)
   ========================================================================== */
function initWorkTabs() {
  const tabs       = document.querySelectorAll('.work-tab');
  const cards      = document.querySelectorAll('.work-card');
  const emptyState = document.getElementById('workEmpty');
  const graphicGrid = document.getElementById('graphicGrid');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // — Update active tab pill —
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      // — Graphic Design: show dedicated grid, hide all cards —
      if (filter === 'graphic') {
        // Hide all case cards immediately
        cards.forEach(card => {
          card.classList.add('hidden');
          card.classList.remove('fade-out');
          card.style.transitionDelay = '';
        });
        if (emptyState) emptyState.style.display = 'none';
        if (graphicGrid) {
          graphicGrid.style.display = 'block';
          // trigger reflow for animation
          void graphicGrid.offsetWidth;
        }
        return;
      }

      // — All other tabs: hide graphic grid, show filtered cards —
      if (graphicGrid) graphicGrid.style.display = 'none';

      let visibleCount = 0;

      cards.forEach((card, i) => {
        const category = card.getAttribute('data-category') || '';
        const matches  = filter === 'all' || category.split(' ').includes(filter);

        if (matches) {
          card.style.display = '';
          card.classList.remove('hidden', 'fade-out');
          card.style.transitionDelay = `${i * 50}ms`;
          visibleCount++;
        } else {
          card.classList.add('fade-out');
          const onEnd = () => {
            card.classList.add('hidden');
            card.classList.remove('fade-out');
            card.style.transitionDelay = '';
            card.removeEventListener('transitionend', onEnd);
          };
          card.addEventListener('transitionend', onEnd);
        }
      });

      // Show / hide empty state
      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }

      // Clear stagger delays after animation
      setTimeout(() => {
        cards.forEach(card => {
          if (!card.classList.contains('hidden')) card.style.transitionDelay = '';
        });
      }, cards.length * 50 + 400);
    });
  });
}

function initProjectSorting() {
  const sortButton = document.getElementById('projectSort');
  const sortMenu = document.getElementById('projectSortMenu');
  const sortValue = sortButton?.querySelector('.sort-select-value');
  const sortOptions = sortMenu ? Array.from(sortMenu.querySelectorAll('.sort-option')) : [];
  const workCards = document.getElementById('workCards');
  const viewOptions = document.querySelectorAll('.view-option');
  if (!workCards) return;

  const getTimestamp = (card) => {
    const value = card.dataset.date || '2000-01-01';
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const setViewMode = (mode) => {
    workCards.dataset.view = mode;
    try {
      localStorage.setItem('sagar_work_view', mode);
    } catch (e) {}
    viewOptions.forEach(option => {
      const isActive = option.dataset.view === mode;
      option.classList.toggle('active', isActive);
      option.setAttribute('aria-pressed', String(isActive));
    });
  };

  const sortCards = (mode) => {
    const cards = Array.from(workCards.querySelectorAll('.work-card'));
    if (!cards.length) return;

    cards.sort((a, b) => {
      const featuredA = a.dataset.featured === 'true' ? 1 : 0;
      const featuredB = b.dataset.featured === 'true' ? 1 : 0;

      if (mode === 'featured') {
        if (featuredA !== featuredB) return featuredB - featuredA;
      }

      if (mode === 'oldest') {
        return getTimestamp(a) - getTimestamp(b);
      }

      return getTimestamp(b) - getTimestamp(a);
    });

    cards.forEach(card => workCards.appendChild(card));
  };

  const preferredView = (() => {
    try {
      const saved = localStorage.getItem('sagar_work_view');
      if (saved === 'cards' || saved === 'list') return saved;
    } catch (e) {}
    return workCards.dataset.view === 'list' ? 'list' : 'cards';
  })();

  viewOptions.forEach(option => {
    option.addEventListener('click', () => {
      setViewMode(option.dataset.view);
    });
  });
  setViewMode(preferredView);

  if (!sortButton || !sortMenu || !sortValue) return;

  const closeSortMenu = (restoreFocus = false) => {
    sortMenu.hidden = true;
    sortButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus) sortButton.focus();
  };

  const openSortMenu = () => {
    sortMenu.hidden = false;
    sortButton.setAttribute('aria-expanded', 'true');
    const activeOption = sortMenu.querySelector('.sort-option.active');
    activeOption?.focus();
  };

  const selectSortOption = (option) => {
    const mode = option.dataset.sort;
    if (!mode) return;

    sortOptions.forEach(item => {
      const isSelected = item === option;
      item.classList.toggle('active', isSelected);
      item.setAttribute('aria-selected', String(isSelected));
    });
    sortValue.textContent = option.textContent.trim();
    sortCards(mode);
    closeSortMenu(true);
  };

  sortButton.addEventListener('click', () => {
    if (sortMenu.hidden) openSortMenu();
    else closeSortMenu();
  });

  sortOptions.forEach((option, index) => {
    option.addEventListener('click', () => selectSortOption(option));
    option.addEventListener('keydown', event => {
      let nextIndex = index;
      if (event.key === 'ArrowDown') nextIndex = (index + 1) % sortOptions.length;
      else if (event.key === 'ArrowUp') nextIndex = (index - 1 + sortOptions.length) % sortOptions.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = sortOptions.length - 1;
      else if (event.key === 'Escape') {
        event.preventDefault();
        closeSortMenu(true);
        return;
      } else if (event.key === 'Tab') {
        closeSortMenu();
        return;
      } else {
        return;
      }

      event.preventDefault();
      sortOptions[nextIndex].focus();
    });
  });

  sortButton.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openSortMenu();
    }
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.sort-select-wrap')) closeSortMenu();
  });

  sortCards(sortMenu.querySelector('.sort-option.active')?.dataset.sort || 'newest');
}

/* ==========================================================================
   LIGHTBOX — Full image viewer for Graphic Design grid & Sketches
   ========================================================================== */
function initLightbox() {
  // Build the lightbox DOM once
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.id = 'graphicLightbox';
  lb.innerHTML = `
    <button class="lightbox-close" id="lbClose" aria-label="Close">✕</button>
    <button class="lightbox-arrow lightbox-arrow-prev" id="lbPrev" aria-label="Previous">‹</button>
    <div class="lightbox-img-wrap" id="lbImgWrap">
      <img id="lbImg" src="" alt="">
      <div class="lightbox-caption">
        <span class="lightbox-caption-title" id="lbTitle"></span>
        <span class="lightbox-caption-sub"  id="lbSub"></span>
      </div>
    </div>
    <button class="lightbox-arrow lightbox-arrow-next" id="lbNext" aria-label="Next">›</button>
  `;
  document.body.appendChild(lb);

  let items   = [];
  let current = 0;

  // Make sketch figures look clickable
  document.querySelectorAll('.sketch').forEach(f => {
    f.style.cursor = 'pointer';
  });

  /* ── Collect items for a given group ── */
  function getItems(group) {
    if (group === 'graphic') {
      items = Array.from(document.querySelectorAll('.graphic-item img')).map(img => {
        const overlay = img.closest('.graphic-item').querySelector('.graphic-overlay span');
        const sub     = img.closest('.graphic-item').querySelector('.graphic-overlay small');
        return {
          src:   img.src,
          title: overlay ? overlay.textContent.trim() : '',
          sub:   sub     ? sub.textContent.trim()     : 'Photoshop · 2026'
        };
      });
    } else if (group === 'sketch') {
      items = Array.from(document.querySelectorAll('.sketch img')).map(img => {
        const caption = img.closest('.sketch')?.querySelector('figcaption');
        return {
          src:   img.src,
          title: caption ? caption.textContent.trim() : '',
          sub:   'Pencil sketch · Sagar Shivaji'
        };
      });
    }
  }

  /* ── Show slide ── */
  function show(idx, group) {
    if (group) getItems(group);
    if (!items.length) return;
    current = (idx + items.length) % items.length;
    const item = items[current];
    const lbImg = document.getElementById('lbImg');
    lbImg.style.opacity = '0';
    lbImg.src = item.src;
    lbImg.alt = item.title;
    lbImg.onload = () => { lbImg.style.opacity = '1'; };
    document.getElementById('lbTitle').textContent = item.title;
    document.getElementById('lbSub').textContent   = item.sub;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /* ── Close ── */
  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  // lbImg fade transition
  document.getElementById('lbImg').style.transition = 'opacity 0.2s ease';

  /* ── Click delegation: Graphic items ── */
  document.addEventListener('click', e => {
    // Graphic Design grid
    const graphicEl = e.target.closest('.graphic-item');
    if (graphicEl) {
      const img = graphicEl.querySelector('img');
      if (!img) return;
      getItems('graphic');
      const idx = items.findIndex(i => i.src === img.src);
      show(idx >= 0 ? idx : 0);
      return;
    }

    // Sketch figures
    const sketchEl = e.target.closest('.sketch');
    if (sketchEl) {
      const img = sketchEl.querySelector('img');
      if (!img) return;
      getItems('sketch');
      const idx = items.findIndex(i => i.src === img.src);
      show(idx >= 0 ? idx : 0);
      return;
    }
  });

  // Arrow nav (stays within the current group)
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', e => {
    e.stopPropagation();
    show(current - 1);
  });
  document.getElementById('lbNext').addEventListener('click', e => {
    e.stopPropagation();
    show(current + 1);
  });

  // Click backdrop to close
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
}

/* ==========================================================================
   SCROLL TO TOP
   ========================================================================== */
function initScrollToTop() {
  const btn = document.createElement('button');
  btn.id = 'scrollTopBtn';
  btn.className = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 480) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ==========================================================================
   FULL CASE STUDY TOGGLE & HASH DEEP-LINKING
   ========================================================================== */
window.toggleFullStory = function() {
  const wrapper = document.getElementById('fullCaseStudy');
  const btnText = document.getElementById('btnFullStoryText');
  const btnIcon = document.getElementById('btnFullStoryIcon');
  if (!wrapper) return;

  const isHidden = (window.getComputedStyle(wrapper).display === 'none') || !wrapper.classList.contains('is-expanded');

  if (isHidden) {
    wrapper.style.display = 'block';
    requestAnimationFrame(() => {
      wrapper.classList.add('is-expanded');
      if (btnText) btnText.textContent = 'Hide full story';
      if (btnIcon) btnIcon.style.transform = 'rotate(180deg)';
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  } else {
    wrapper.classList.remove('is-expanded');
    setTimeout(() => {
      wrapper.style.display = 'none';
    }, 300);
    if (btnText) btnText.textContent = 'Read full story';
    if (btnIcon) btnIcon.style.transform = 'rotate(0deg)';
    const card = document.getElementById('csOverviewCard');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

function initFullStoryToggle() {
  const wrapper = document.getElementById('fullCaseStudy');
  if (!wrapper) return;

  // Auto-expand if page loads with an anchor hash
  if (window.location.hash && window.location.hash !== '#') {
    wrapper.style.display = 'block';
    wrapper.classList.add('is-expanded');
    const btnText = document.getElementById('btnFullStoryText');
    const btnIcon = document.getElementById('btnFullStoryIcon');
    if (btnText) btnText.textContent = 'Hide full story';
    if (btnIcon) btnIcon.style.transform = 'rotate(180deg)';
  }
}

/* ==========================================================================
   HOME PAGE AUTO-SCROLLING ART & GRAPHIC DESIGN CAROUSEL
   ========================================================================== */
function initArtCarousel() {
  const viewport = document.getElementById('artCarouselViewport');
  const track = document.getElementById('artCarouselTrack');
  if (!viewport || !track) return;

  let isPaused = false;
  let autoScrollSpeed = 0.85; // pixels per frame
  let animId = null;

  // Smooth continuous auto-scroll loop
  function stepScroll() {
    if (!isPaused) {
      viewport.scrollLeft += autoScrollSpeed;
      // Loop seamlessly when near end
      if (viewport.scrollLeft >= (viewport.scrollWidth - viewport.clientWidth - 2)) {
        viewport.scrollLeft = 0;
      }
    }
    animId = requestAnimationFrame(stepScroll);
  }
  animId = requestAnimationFrame(stepScroll);

  // Pause on hover / touch
  viewport.addEventListener('mouseenter', () => { isPaused = true; });
  viewport.addEventListener('mouseleave', () => { 
    const playPauseBtn = document.getElementById('artCarouselPlayPause');
    if (!playPauseBtn || playPauseBtn.dataset.state !== 'paused') {
      isPaused = false; 
    }
  });
  viewport.addEventListener('touchstart', () => { isPaused = true; }, { passive: true });
  viewport.addEventListener('touchend', () => { 
    const playPauseBtn = document.getElementById('artCarouselPlayPause');
    if (!playPauseBtn || playPauseBtn.dataset.state !== 'paused') {
      isPaused = false; 
    }
  });

  // Controls: Prev / Next
  const prevBtn = document.getElementById('artCarouselPrev');
  const nextBtn = document.getElementById('artCarouselNext');
  const playPauseBtn = document.getElementById('artCarouselPlayPause');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      viewport.scrollBy({ left: -320, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      viewport.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (playPauseBtn.dataset.state === 'paused') {
        isPaused = false;
        playPauseBtn.dataset.state = 'playing';
        playPauseBtn.innerHTML = '⏸';
        playPauseBtn.title = 'Pause auto-scroll';
      } else {
        isPaused = true;
        playPauseBtn.dataset.state = 'paused';
        playPauseBtn.innerHTML = '▶';
        playPauseBtn.title = 'Resume auto-scroll';
      }
    });
  }

  // Filter Buttons
  const filterPills = document.querySelectorAll('#artCarouselFilter .art-filter-pill');
  const cards = track.querySelectorAll('.art-carousel-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
      viewport.scrollLeft = 0;
    });
  });

  // Lightbox click on art cards
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.getAttribute('data-img');
      const title = card.getAttribute('data-title') || '';
      const sub = card.getAttribute('data-sub') || '';
      const lb = document.getElementById('lightbox');
      const lbImg = document.getElementById('lbImg');
      const lbCaption = document.getElementById('lbCaption');
      if (lb && lbImg) {
        lbImg.src = img;
        if (lbCaption) lbCaption.textContent = title + (sub ? ' — ' + sub : '');
        lb.classList.add('active');
      }
    });
  });
}
