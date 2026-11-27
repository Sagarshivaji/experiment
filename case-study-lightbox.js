(() => {
  const style = document.createElement('style');
  style.textContent = `
    .cs-lightbox-frame { position: relative; }
    .cs-lightbox-trigger {
      position: absolute;
      right: 14px;
      bottom: 14px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border: 1px solid rgba(255,255,255,.65);
      border-radius: 999px;
      background: rgba(32,33,36,.88);
      color: #fff;
      font: 600 0.85rem 'Google Sans', 'Outfit', sans-serif;
      box-shadow: 0 8px 24px rgba(32,33,36,.22);
      cursor: zoom-in;
      backdrop-filter: blur(8px);
      transition: transform .2s ease, background .2s ease;
    }
    .cs-lightbox-trigger:hover { transform: translateY(-2px); background: rgba(32,33,36,1); }
    .cs-lightbox-trigger svg { width: 17px; height: 17px; }
    .cs-lightbox {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: rgba(0,0,0,.92);
      backdrop-filter: blur(12px);
    }
    .cs-lightbox.is-open { display: flex; }
    .cs-lightbox img {
      max-width: calc(100vw - 48px);
      max-height: calc(100vh - 48px);
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 24px 80px rgba(0,0,0,.45);
    }
    .cs-lightbox-close {
      position: fixed;
      top: 18px;
      right: 18px;
      width: 44px;
      height: 44px;
      border: 1px solid rgba(255,255,255,.18);
      border-radius: 50%;
      background: rgba(255,255,255,.12);
      color: #fff;
      font-size: 25px;
      line-height: 1;
      cursor: pointer;
      z-index: 10000;
    }
    .cs-lightbox-close:hover { background: rgba(255,255,255,.22); }
    @media (max-width: 768px) {
      .cs-lightbox-trigger { right: 10px; bottom: 10px; padding: 9px 12px; }
      .cs-lightbox-trigger span { display: none; }
      .cs-lightbox { padding: 12px; }
      .cs-lightbox img { max-width: calc(100vw - 24px); max-height: calc(100vh - 24px); }
    }
  `;
  document.head.appendChild(style);

  const lightbox = document.createElement('div');
  lightbox.className = 'cs-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <button class="cs-lightbox-close" type="button" aria-label="Close full-size image">&times;</button>
    <img src="" alt="">
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector('img');
  const closeButton = lightbox.querySelector('.cs-lightbox-close');

  const openLightbox = (image) => {
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || 'Full-size case study image';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImage.src = '';
  };

  document.querySelectorAll('.hero-banner-image, .cs-img-frame').forEach(frame => {
    const image = frame.querySelector('img');
    if (!image) return;

    frame.classList.add('cs-lightbox-frame');
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'cs-lightbox-trigger';
    trigger.setAttribute('aria-label', `View ${image.alt || 'case study image'} in full size`);
    trigger.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="6"></circle><path d="M16 16l4 4M11 8v6M8 11h6"></path></svg><span>View full image</span>`;
    trigger.addEventListener('click', () => openLightbox(image));
    frame.appendChild(trigger);
  });

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
})();
