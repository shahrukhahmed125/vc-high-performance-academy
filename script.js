/**
 * VC HIGH PERFORMANCE ACADEMY
 * Core Vanilla JavaScript
 * High Performance Without Burnout
 */

document.addEventListener('DOMContentLoaded', () => {
  // Official application / registration form URL (easy to configure)
  const OFFICIAL_REGISTRATION_URL = "https://forms.gle/ihfyLVqnKZ1MQ8sb8";

  // --- Sticky Header on Scroll ---
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.querySelector('.back-to-top');

  const handleScroll = () => {
    const scrollPos = window.scrollY || window.pageYOffset;

    if (header) {
      if (scrollPos > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // --- Back to Top Smooth Scroll ---
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Mobile Navigation Offcanvas Drawer ---
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  let navBackdrop = document.querySelector('.nav-backdrop');

  // Create backdrop if not already in markup
  if (!navBackdrop && mainNav) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    document.body.appendChild(navBackdrop);
  }

  // Ensure dedicated Drawer Header with Logo & Close Button exists inside mainNav
  if (mainNav && !mainNav.querySelector('.drawer-header')) {
    const drawerHeader = document.createElement('div');
    drawerHeader.className = 'drawer-header';
    drawerHeader.innerHTML = `
      <div class="drawer-brand">
        <span class="drawer-logo-icon">W</span>
        <div class="drawer-brand-text">
          <strong>VC HIGH PERFORMANCE</strong>
          <small>ACADEMY &bull; LONDON</small>
        </div>
      </div>
      <button type="button" class="drawer-close-btn" aria-label="Close menu">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;
    mainNav.insertBefore(drawerHeader, mainNav.firstChild);

    const closeBtn = drawerHeader.querySelector('.drawer-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileNav(false);
      });
    }
  }

  const toggleMobileNav = (open) => {
    if (!mainNav) return;
    const shouldOpen = open !== undefined ? open : !mainNav.classList.contains('active');
    
    mainNav.classList.toggle('active', shouldOpen);
    if (navBackdrop) navBackdrop.classList.toggle('active', shouldOpen);
    document.body.classList.toggle('nav-open', shouldOpen);
    if (header) header.classList.toggle('nav-open', shouldOpen);

    // Prevent background scrolling while offcanvas is open
    document.body.style.overflow = shouldOpen ? 'hidden' : '';

    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      mobileToggle.innerHTML = shouldOpen
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    }
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMobileNav();
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMobileNav(false);
    });
  }

  // Close nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav && mainNav.classList.contains('active')) {
      toggleMobileNav(false);
    }
  });

  // Automatically close mobile nav if viewport resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 991 && mainNav && mainNav.classList.contains('active')) {
      toggleMobileNav(false);
    }
  });

  // Mobile Dropdown Click Accordion
  const dropdownItems = document.querySelectorAll('.nav-item-dropdown');
  dropdownItems.forEach((item) => {
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 991) {
          // If clicking dropdown parent on mobile, toggle submenu accordion
          e.preventDefault();
          e.stopPropagation();
          item.classList.toggle('mobile-open');
        }
      });
    }
  });

  // Close mobile nav when clicking any actual navigation link inside the drawer
  if (mainNav) {
    const clickableLinks = mainNav.querySelectorAll('a:not(.nav-item-dropdown > .nav-link)');
    clickableLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 991) {
          toggleMobileNav(false);
        }
      });
    });
  }

  // --- Active Link Indicator ---
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      const parentDropdown = link.closest('.nav-item-dropdown');
      if (parentDropdown) {
        const parentLink = parentDropdown.querySelector('.nav-link');
        if (parentLink) parentLink.classList.add('active');
      }
    }
  });

  // --- Scroll Reveal Animations (IntersectionObserver) ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll('.reveal-fade-up');
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Immediate display if reduced motion or older browser
    document.querySelectorAll('.reveal-fade-up').forEach((el) => {
      el.classList.add('is-revealed');
    });
  }

  // --- FAQ Accordion ---
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isExpanded = item.classList.contains('active');

      // Close other open items
      document.querySelectorAll('.faq-item.active').forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isExpanded) {
        item.classList.remove('active');
        if (answer) answer.style.maxHeight = null;
        button.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- Category Filter Tabs (Blog & Workshops) ---
  const filterTabs = document.querySelectorAll('.filter-tab');
  const filterCards = document.querySelectorAll('[data-category]');

  if (filterTabs.length && filterCards.length) {
    filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-filter');

        // Update active tab
        filterTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter cards
        filterCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          if (category === 'all' || cardCategory === category) {
            card.style.display = '';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 20);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 200);
          }
        });
      });
    });
  }

  // --- Contact Form Validation & Submission Handling ---
  const contactForm = document.getElementById('academyContactForm');
  if (contactForm) {
    const alertBox = document.getElementById('formAlert');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const phoneInput = document.getElementById('senderPhone');
      const programmeInput = document.getElementById('programmeInterest');
      const messageInput = document.getElementById('senderMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const programme = programmeInput ? programmeInput.value : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        if (alertBox) {
          alertBox.className = 'form-alert error';
          alertBox.innerHTML = '<strong>Please check your details:</strong> Name, Email, and Message are required.';
          alertBox.style.display = 'block';
        }
        return;
      }

      if (!emailPattern.test(email)) {
        if (alertBox) {
          alertBox.className = 'form-alert error';
          alertBox.innerHTML = '<strong>Invalid Email:</strong> Please enter a valid email address.';
          alertBox.style.display = 'block';
        }
        return;
      }

      // Successful client-side validation
      if (alertBox) {
        alertBox.className = 'form-alert success';
        alertBox.innerHTML = `
          <strong>Thank you, ${name}!</strong> Your enquiry regarding <em>${programme || 'our programmes'}</em> has been prepared.
          <div style="margin-top: 8px; font-size: 0.8125rem;">
            A direct communication draft to <strong>vchighperformance.uk@gmail.com</strong> has been initiated. Our admissions team in London will respond within 24 business hours.
          </div>
        `;
        alertBox.style.display = 'block';
      }

      // Open mailto link so the user's email client prepares the verified enquiry
      const mailSubject = encodeURIComponent(`VC Academy Enquiry: ${programme || 'General Enquiry'} - ${name}`);
      const mailBody = encodeURIComponent(
        `Hello VC High Performance Academy Team,\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nProgramme Interest: ${programme || 'General'}\n\nMessage:\n${message}\n\nSent from vchighperformance.com`
      );
      
      const mailtoLink = `mailto:vchighperformance.uk@gmail.com?subject=${mailSubject}&body=${mailBody}`;
      
      // Attempt opening mail client safely
      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 700);

      contactForm.reset();
    });
  }

  // ==========================================================================
  // 1. INTERACTIVE PARTICLE CANVAS SYSTEM FOR WHITE / LIGHT SECTIONS
  // ==========================================================================
  const initSectionParticleCanvas = () => {
    // Select all white/light sections
    const lightSections = document.querySelectorAll(
      '.section.bg-soft, .section.bg-light-purple, section:not(.bg-deep-purple):not(.hero-section)'
    );

    lightSections.forEach((section) => {
      if (section.querySelector('.section-particle-canvas')) return; // Avoid duplicate canvas

      const canvas = document.createElement('canvas');
      canvas.className = 'section-particle-canvas';
      section.insertBefore(canvas, section.firstChild);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let width = (canvas.width = section.offsetWidth);
      let height = (canvas.height = section.offsetHeight);

      const mouse = { x: -1000, y: -1000, isHovering: false };

      // Generate 35 particles per light section
      const numParticles = Math.min(Math.floor((width * height) / 18000), 45);
      const particles = [];

      const colors = [
        'rgba(113, 54, 154, ', // Deep purple
        'rgba(168, 85, 247, ', // Light violet
        'rgba(75, 23, 107, ',  // Midnight purple
        'rgba(147, 51, 234, '   // Bright purple
      ];

      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.5 + 1.2,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          colorBase: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.35 + 0.15
        });
      }

      // Handle window resize
      const handleResize = () => {
        width = canvas.width = section.offsetWidth;
        height = canvas.height = section.offsetHeight;
      };
      window.addEventListener('resize', handleResize, { passive: true });

      // Track mouse position over section
      section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.isHovering = true;
      });

      section.addEventListener('mouseleave', () => {
        mouse.isHovering = false;
        mouse.x = -1000;
        mouse.y = -1000;
      });

      // Animation Loop
      const animate = () => {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Particle position movement
          p.x += p.vx;
          p.y += p.vy;

          // Bounce off canvas boundaries
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          // Mouse cursor interaction & subtle pull
          if (mouse.isHovering) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxMouseDist = 140;

            if (dist < maxMouseDist) {
              // Draw fine purple connection line to cursor
              const lineAlpha = (1 - dist / maxMouseDist) * 0.4;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = `rgba(113, 54, 154, ${lineAlpha})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();

              // Subtle drift towards mouse
              p.x += (dx / dist) * 0.3;
              p.y += (dy / dist) * 0.3;
            }
          }

          // Draw Particle dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${p.colorBase}${p.alpha})`;
          ctx.fill();

          // Connect nearby particles with subtle lines
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx2 = p.x - p2.x;
            const dy2 = p.y - p2.y;
            const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
            if (dist2 < 100) {
              const alpha2 = (1 - dist2 / 100) * 0.18;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(113, 54, 154, ${alpha2})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }

        requestAnimationFrame(animate);
      };

      animate();
    });
  };

  initSectionParticleCanvas();

  // ==========================================================================
  // 2. WHY CHOOSE CAROUSEL PLAY / PAUSE TOGGLE BUTTON
  // ==========================================================================
  const carouselToggleBtn = document.getElementById('carouselToggleBtn');
  const whyChooseTrack = document.getElementById('whyChooseTrack');

  if (carouselToggleBtn && whyChooseTrack) {
    let isPaused = false;

    carouselToggleBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      whyChooseTrack.classList.toggle('is-paused', isPaused);

      const iconPause = carouselToggleBtn.querySelector('.icon-pause');
      const iconPlay = carouselToggleBtn.querySelector('.icon-play');
      const btnText = carouselToggleBtn.querySelector('.carousel-btn-text');

      if (isPaused) {
        if (iconPause) iconPause.classList.add('hidden');
        if (iconPlay) iconPlay.classList.remove('hidden');
        if (btnText) btnText.textContent = 'Play Carousel';
      } else {
        if (iconPlay) iconPlay.classList.add('hidden');
        if (iconPause) iconPause.classList.remove('hidden');
        if (btnText) btnText.textContent = 'Pause Carousel';
      }
    });
  }

  // ==========================================================================
  // 3. SILKY SMOOTH HERO TITLE TYPEWRITER (Zero Layout Shift)
  // ==========================================================================
  const typewriterHighlight = document.getElementById('typewriterHighlight');

  if (typewriterHighlight) {
    const phrases = [
      "Without Burnout",
      "Somatic Mastery",
      "Sustainable Leadership",
      "Applied Positive Psychology",
      "Professional Excellence"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 75;

    const runTypewriter = () => {
      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        typewriterHighlight.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentPhrase.length) {
          // Pause at full word
          setTimeout(() => {
            isDeleting = true;
            runTypewriter();
          }, 3500);
          return;
        }
      } else {
        typewriterHighlight.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(runTypewriter, 350);
          return;
        }
      }

      const currentSpeed = isDeleting ? 40 : typeSpeed;
      setTimeout(runTypewriter, currentSpeed);
    };

    // Start typewriter smoothly
    setTimeout(runTypewriter, 600);
  }
});

