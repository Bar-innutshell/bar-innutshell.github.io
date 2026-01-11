// ===== Toggle & Responsive Navigation =====
const navSlide = () => {
  const burger = document.querySelector(".burger");
  const navLists = document.querySelector("nav");
  const overlay = document.querySelector(".nav-overlay");
  const navLinks = document.querySelectorAll("nav ul li a");

  // Toggle navigation
  const toggleNav = () => {
    navLists.classList.toggle("nav-active");
    burger.classList.toggle("toggle-burger");

    if (overlay) {
      overlay.classList.toggle("active");
    }

    // Prevent body scroll when nav is open
    document.body.style.overflow = navLists.classList.contains("nav-active") ? "hidden" : "";
  };

  burger.addEventListener("click", toggleNav);

  // Close nav when clicking overlay
  if (overlay) {
    overlay.addEventListener("click", toggleNav);
  }

  // Close nav when clicking a link
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (navLists.classList.contains("nav-active")) {
        toggleNav();
      }
    });
  });
};

navSlide();

// ===== Dark Mode Toggle =====
const initTheme = () => {
  const themeToggle = document.querySelector(".theme-toggle");
  const html = document.documentElement;

  // Check for saved theme preference or system preference
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    // Check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  // Apply theme
  const setTheme = (theme) => {
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  // Initialize with preferred theme
  setTheme(getPreferredTheme());

  // Toggle theme on button click
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = html.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    });
  }

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });
};

initTheme();

// ===== Form Reset on Page Unload =====
window.onbeforeunload = () => {
  for (const form of document.getElementsByTagName("form")) {
    form.reset();
  }
};

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerHeight = window.innerWidth > 825 ? 80 : 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== Portfolio Tags Overflow Check =====
const checkTagsOverflow = () => {
  const tagsContainers = document.querySelectorAll('.portfolio-tags');

  tagsContainers.forEach(container => {
    const inner = container.querySelector('.portfolio-tags-inner');
    if (inner && inner.scrollWidth > container.clientWidth) {
      container.classList.add('scrollable');

      // Duplicate content for seamless infinite scroll if not already duplicated
      if (!inner.dataset.duplicated) {
        const originalContent = inner.innerHTML;
        inner.innerHTML = originalContent + originalContent;
        inner.dataset.duplicated = 'true';
      }
    } else {
      container.classList.remove('scrollable');
    }
  });
};

// Run on load and resize
window.addEventListener('load', checkTagsOverflow);
window.addEventListener('resize', checkTagsOverflow);

// ===== Header Scroll Effect (Optional Enhancement) =====
const headerScrollEffect = () => {
  const nav = document.querySelector('.nav');

  if (window.innerWidth > 825) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.style.padding = '0.75rem calc((100% - 1200px) / 2 + 1rem)';
      } else {
        nav.style.padding = '1rem calc((100% - 1200px) / 2 + 1rem)';
      }
    });
  }
};

headerScrollEffect();

// ===== Portfolio Tabs Switching =====
const initPortfolioTabs = () => {
  const tabs = document.querySelectorAll('.portfolio-tab');
  const slides = document.querySelectorAll('.portfolio-slide');
  const slidesContainer = document.querySelector('.portfolio-slides');
  const slider = document.querySelector('.portfolio-slider');
  const portfolioSection = document.querySelector('#portfolios');

  if (!tabs.length || !slides.length) return;

  // Function to update slider height based on active slide
  const updateSliderHeight = () => {
    const activeSlide = document.querySelector('.portfolio-slide.active');
    if (activeSlide && slider) {
      // Get the actual height of the active slide content
      const height = activeSlide.offsetHeight;
      slider.style.height = `${height}px`;
    }
  };

  // Initial height set
  setTimeout(updateSliderHeight, 100);

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      // Store current scroll position relative to portfolio section
      const portfolioRect = portfolioSection.getBoundingClientRect();
      const viewportTop = portfolioRect.top;
      const wasAboveViewport = viewportTop < 0;

      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active to clicked tab
      tab.classList.add('active');

      // Get target slide ID
      const target = tab.dataset.target;

      // Hide all slides and show target
      slides.forEach(slide => {
        slide.classList.remove('active');
        if (slide.id === target) {
          slide.classList.add('active');
        }
      });

      // Update slider height after transition
      setTimeout(() => {
        updateSliderHeight();

        // If user was viewing the portfolio section, scroll to keep it in view
        if (wasAboveViewport) {
          const headerHeight = window.innerWidth > 825 ? 80 : 0;
          const newPortfolioTop = portfolioSection.offsetTop - headerHeight;
          window.scrollTo({
            top: newPortfolioTop,
            behavior: 'smooth'
          });
        }
      }, 50);

      // Re-check tags overflow for the new visible slide
      checkTagsOverflow();
    });
  });

  // Update height on window resize
  window.addEventListener('resize', updateSliderHeight);
};

initPortfolioTabs();

// ===== Navigation Dropdown Portfolio Switcher =====
const initDropdownPortfolioSwitch = () => {
  const dropdownLinks = document.querySelectorAll('.dropdown-menu a[data-portfolio]');
  const navDropdown = document.querySelector('.nav-dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');

  // Mobile: Toggle dropdown on click
  if (dropdownToggle && navDropdown) {
    dropdownToggle.addEventListener('click', (e) => {
      // Only prevent default and toggle on mobile
      if (window.innerWidth <= 825) {
        e.preventDefault();
        navDropdown.classList.toggle('active');
      }
    });
  }

  dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.dataset.portfolio;
      const targetTab = document.querySelector(`.portfolio-tab[data-target="${target}"]`);

      if (targetTab) {
        // Simulate click on the portfolio tab
        targetTab.click();
      }

      // Close mobile dropdown after selection
      if (navDropdown) {
        navDropdown.classList.remove('active');
      }
    });
  });
};

initDropdownPortfolioSwitch();

// ===== Photo Carousel in Cards =====
const initPhotoCarousels = () => {
  const carousels = document.querySelectorAll('.photo-carousel');

  carousels.forEach(carousel => {
    const slides = carousel.querySelector('.photo-carousel-slides');
    const slideElements = carousel.querySelectorAll('.photo-carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    if (!slides || slideElements.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slideElements.length;

    const goToSlide = (index) => {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;

      currentIndex = index;
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(index);
      });
    });

    // Touch/Swipe support
    let startX = 0;
    let isDragging = false;

    slides.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    slides.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
    });

    slides.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;

      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }
    });
  });
};

initPhotoCarousels();

// ===== Lightbox / Photo Popup =====
const initLightbox = () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxSlides = document.getElementById('lightbox-slides');
  const lightboxGallery = document.getElementById('lightbox-gallery');
  const lightboxCurrent = document.getElementById('lightbox-current');
  const lightboxTotal = document.getElementById('lightbox-total');
  const closeBtn = lightbox?.querySelector('.lightbox-close');
  const prevBtn = lightbox?.querySelector('.lightbox-prev');
  const nextBtn = lightbox?.querySelector('.lightbox-next');

  if (!lightbox) return;

  let currentImages = [];
  let currentIndex = 0;

  const openLightbox = (images, startIndex = 0) => {
    currentImages = images;
    currentIndex = startIndex;

    // Build slides
    lightboxSlides.innerHTML = images.map((img, i) => `
      <div class="lightbox-slide">
        <img src="${img.src}" alt="${img.alt || 'Photo ' + (i + 1)}" />
      </div>
    `).join('');

    // Build thumbnails
    lightboxGallery.innerHTML = images.map((img, i) => `
      <div class="lightbox-thumb ${i === startIndex ? 'active' : ''}" data-index="${i}">
        <img src="${img.src}" alt="${img.alt || 'Thumbnail ' + (i + 1)}" />
      </div>
    `).join('');

    // Update counter
    lightboxTotal.textContent = images.length;

    // Add thumbnail click events
    lightboxGallery.querySelectorAll('.lightbox-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        goToImage(parseInt(thumb.dataset.index));
      });
    });

    goToImage(startIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const goToImage = (index) => {
    if (index < 0) index = currentImages.length - 1;
    if (index >= currentImages.length) index = 0;

    currentIndex = index;
    lightboxSlides.style.transform = `translateX(-${currentIndex * 100}%)`;
    lightboxCurrent.textContent = currentIndex + 1;

    // Update thumbnails
    lightboxGallery.querySelectorAll('.lightbox-thumb').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentIndex);
    });

    // Scroll thumbnail into view
    const activeThumb = lightboxGallery.querySelector('.lightbox-thumb.active');
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  // Event listeners
  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => goToImage(currentIndex - 1));
  nextBtn?.addEventListener('click', () => goToImage(currentIndex + 1));

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-main')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        goToImage(currentIndex - 1);
        break;
      case 'ArrowRight':
        goToImage(currentIndex + 1);
        break;
    }
  });

  // Touch swipe in lightbox
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });

  lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToImage(currentIndex + 1);
      } else {
        goToImage(currentIndex - 1);
      }
    }
  });

  // Make photos clickable to open lightbox
  document.querySelectorAll('.photo-card').forEach(card => {
    const images = Array.from(card.querySelectorAll('.photo-carousel-slide img')).map(img => ({
      src: img.src,
      alt: img.alt
    }));

    card.querySelectorAll('.photo-carousel-slide img').forEach((img, index) => {
      img.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(images, index);
      });
    });
  });
};

initLightbox();

// ===== Contact Form with Anti-Spam & AJAX =====
const initContactForm = () => {
  const form = document.querySelector('#contact-form');
  const notification = document.querySelector('#notification-popup');

  if (!form) return;

  const showNotification = () => {
    if (notification) {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
      }, 5000);
    } else {
      alert('Pesan terkirim, Terimakasih sudah mengirimkan pesan 😁');
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Anti-Spam Logic
    const RATE_LIMIT_HOURS = 1;
    const MAX_SUBMISSIONS = 2;
    const now = Date.now();

    // Get stored data
    let submissions = JSON.parse(localStorage.getItem('formSubmissions') || '{"count": 0, "timestamp": 0}');

    // Check if rate limit period has passed
    const timeDiff = now - submissions.timestamp;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff >= RATE_LIMIT_HOURS) {
      // Reset if more than 1 hour passed
      submissions = { count: 0, timestamp: now };
    }

    if (submissions.count >= MAX_SUBMISSIONS) {
      alert(`Mohon maaf, Anda telah mencapai batas pengiriman pesan, Silakan coba lagi nanti.`);
      return;
    }

    // Submit form via AJAX
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;

    // Loading state
    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success
        form.reset();
        showNotification();

        // Update anti-spam storage
        submissions.count += 1;
        // Logic: if count was 0, set timestamp. If count > 0, keep timestamp (window starts from first msg)
        if (submissions.count === 1) {
          submissions.timestamp = now;
        }
        localStorage.setItem('formSubmissions', JSON.stringify(submissions));

      } else {
        // Error
        const data = await response.json();
        if (Object.hasOwn(data, 'errors')) {
          alert(data['errors'].map(error => error['message']).join(", "));
        } else {
          alert('Oops! Ada masalah saat mengirim pesan Anda.');
        }
      }
    } catch (error) {
      alert('Oops! Ada masalah saat mengirim pesan Anda.');
    } finally {
      // Reset button
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    }
  });
};

initContactForm();