(function () {
    const navContainer = document.querySelector('.navbar .nav-container');
    if (!navContainer) return;

    const navLinks = navContainer.querySelector('.nav-links');
    if (!navLinks) return;

    const style = document.createElement('style');
    style.textContent = `
        .navbar .nav-container { position: relative; }
        .menu-toggle {
            display: none;
            width: 44px;
            height: 44px;
            border: 1px solid var(--border-color, #dadce0);
            border-radius: 50%;
            background: var(--bg-color, #fff);
            color: var(--text-main, #202124);
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 5px;
            cursor: pointer;
        }
        .menu-toggle span {
            width: 18px;
            height: 2px;
            border-radius: 2px;
            background: currentColor;
            transition: transform 0.25s ease, opacity 0.25s ease;
        }
        .menu-toggle.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .menu-toggle.active span:nth-child(2) { opacity: 0; }
        .menu-toggle.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        @media (max-width: 768px) {
            .navbar .menu-toggle { display: flex; }
            .navbar .nav-links {
                display: none;
                position: absolute;
                top: calc(100% + 8px);
                left: 24px;
                right: 24px;
                padding: 12px;
                flex-direction: column;
                align-items: stretch;
                gap: 4px;
                background: rgba(255, 255, 255, 0.98);
                border: 1px solid var(--border-color, #dadce0);
                border-radius: 16px;
                box-shadow: 0 16px 40px rgba(32, 33, 36, 0.12);
                z-index: 200;
            }
            .navbar .nav-links.open { display: flex; }
            .navbar .nav-links a:not(.btn) {
                display: block;
                padding: 12px 14px;
                border-radius: 10px;
            }
            .navbar .nav-links a:not(.btn)::after { display: none; }
            .navbar .nav-links .btn { margin-top: 6px; }
        }
    `;
    document.head.appendChild(style);

    let menuToggle = navContainer.querySelector('.menu-toggle');
    if (!menuToggle) {
        menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.type = 'button';
        menuToggle.setAttribute('aria-label', 'Open navigation menu');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-controls', 'mobile-nav');
        menuToggle.innerHTML = '<span></span><span></span><span></span>';
        navContainer.appendChild(menuToggle);
    }

    navLinks.id = navLinks.id || 'mobile-nav';

    const setMenuOpen = (open) => {
        menuToggle.classList.toggle('active', open);
        navLinks.classList.toggle('open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    };

    menuToggle.addEventListener('click', () => {
        setMenuOpen(!navLinks.classList.contains('open'));
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('.nav-container')) setMenuOpen(false);
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') setMenuOpen(false);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) setMenuOpen(false);
    });
})();
