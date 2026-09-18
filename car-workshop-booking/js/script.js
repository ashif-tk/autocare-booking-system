/**
 * AutoCare Workshop - Interactive Features & Validation
 * Vanilla JavaScript ES6
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initStickyHeader();
  initMobileNavigation();
  initServiceSelection();
  initFormValidation();
  initFaqAccordion();
  initScrollReveal();
  initActiveNavHighlighting();
});

/* ==========================================================================
   1. Sticky Header & Shadow
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   2. Mobile Hamburger Navigation
   ========================================================================== */
function initMobileNavigation() {
  const hamburgerBtn = document.getElementById('hamburger-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburgerBtn || !navMenu) return;

  // Toggle mobile menu
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = hamburgerBtn.classList.contains('is-active');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close menu on resize if screen becomes large
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });

  function openMobileMenu() {
    hamburgerBtn.classList.add('is-active');
    navMenu.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    hamburgerBtn.classList.remove('is-active');
    navMenu.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
}

/* ==========================================================================
   3. Service Card Pre-Selection & Smooth Scroll to Booking
   ========================================================================== */
function initServiceSelection() {
  const selectServiceBtns = document.querySelectorAll('.service-select-btn');
  const serviceDropdown = document.getElementById('service-select');
  const bookingSection = document.getElementById('booking');

  if (!selectServiceBtns.length || !serviceDropdown) return;

  selectServiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetService = btn.getAttribute('data-service');

      if (targetService) {
        // Find matching option in dropdown
        for (let option of serviceDropdown.options) {
          if (option.value.toLowerCase() === targetService.toLowerCase()) {
            serviceDropdown.value = option.value;
            break;
          }
        }

        // Clear error on service dropdown if existing
        clearFieldError(serviceDropdown);

        // Flash visual highlight on the dropdown container
        serviceDropdown.classList.remove('field-highlight');
        void serviceDropdown.offsetWidth; // Trigger reflow
        serviceDropdown.classList.add('field-highlight');

        // Smooth scroll to booking form section
        if (bookingSection) {
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
          const targetPosition = bookingSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/* ==========================================================================
   4. Form Validation & Booking Confirmation Modal
   ========================================================================== */
function initFormValidation() {
  const bookingForm = document.getElementById('booking-form');
  const dateInput = document.getElementById('preferred-date');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const bookAnotherBtn = document.getElementById('book-another-btn');

  if (!bookingForm) return;

  // Set min date to today's date (YYYY-MM-DD)
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Clear errors in real-time as user interacts with form fields
  const inputs = bookingForm.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => clearFieldError(input));
    input.addEventListener('change', () => clearFieldError(input));
  });

  // Handle Form Submission
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    let firstInvalidInput = null;

    // 1. Customer Name
    const nameInput = document.getElementById('customer-name');
    if (!nameInput.value.trim()) {
      showFieldError(nameInput, 'Please enter your full name.');
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = nameInput;
    }

    // 2. Phone Number
    const phoneInput = document.getElementById('phone-number');
    const phoneRegex = /^[\d\s\+\-\(\)]{10,15}$/;
    if (!phoneInput.value.trim()) {
      showFieldError(phoneInput, 'Please enter your phone number.');
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = phoneInput;
    } else if (!phoneRegex.test(phoneInput.value.trim())) {
      showFieldError(phoneInput, 'Please enter a valid 10-digit phone number.');
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = phoneInput;
    }

    // 3. Email Address
    const emailInput = document.getElementById('email-address');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      showFieldError(emailInput, 'Please enter your email address.');
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = emailInput;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showFieldError(emailInput, 'Please enter a valid email format (e.g. name@domain.com).');
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = emailInput;
    }

    // 4. Car Brand
    const brandInput = document.getElementById('car-brand');
    if (!brandInput.value.trim()) {
      showFieldError(brandInput, 'Please enter your car brand.');
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = brandInput;
    }

    // 5. Car Model
    const modelInput = document.getElementById('car-model');
    if (!modelInput.value.trim()) {
      showFieldError(modelInput, 'Please enter your car model.');
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = modelInput;
    }

    // 6. Registration Number
    const regInput = document.getElementById('reg-number');
    if (!regInput.value.trim()) {
      showFieldError(regInput, 'Please enter vehicle registration number.');
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = regInput;
    }

    // 7. Service Selection
    const serviceInput = document.getElementById('service-select');
    if (!serviceInput.value) {
      showFieldError(serviceInput, 'Please select a service.');
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = serviceInput;
    }

    // 8. Preferred Date
    const dateVal = dateInput.value;
    const todayStr = new Date().toISOString().split('T')[0];
    if (!dateVal) {
      showFieldError(dateInput, 'Please select a preferred date.');
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = dateInput;
    } else if (dateVal < todayStr) {
      showFieldError(dateInput, 'Date cannot be in the past.');
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = dateInput;
    }

    // 9. Preferred Time
    const timeInput = document.getElementById('preferred-time');
    if (!timeInput.value) {
      showFieldError(timeInput, 'Please select a preferred time.');
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = timeInput;
    }

    // Focus first invalid input if validation failed
    if (!isValid) {
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    // Form is Valid -> Show Modal with Summary Data
    populateModalSummary({
      name: nameInput.value.trim(),
      vehicle: `${brandInput.value.trim()} ${modelInput.value.trim()} (${regInput.value.trim().toUpperCase()})`,
      service: serviceInput.options[serviceInput.selectedIndex].text,
      date: formatDateString(dateInput.value),
      time: timeInput.options[timeInput.selectedIndex].text
    });

    openConfirmationModal();
  });

  // Modal Control Functions
  function openConfirmationModal() {
    if (modalOverlay) {
      modalOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeConfirmationModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  // Populate Modal Details
  function populateModalSummary(data) {
    document.getElementById('summary-name').textContent = data.name;
    document.getElementById('summary-vehicle').textContent = data.vehicle;
    document.getElementById('summary-service').textContent = data.service;
    document.getElementById('summary-date').textContent = data.date;
    document.getElementById('summary-time').textContent = data.time;
  }

  // Modal event listeners
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeConfirmationModal);
  }

  if (bookAnotherBtn) {
    bookAnotherBtn.addEventListener('click', () => {
      closeConfirmationModal();
      bookingForm.reset();
      // Reset min date constraint
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeConfirmationModal();
      }
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('is-active')) {
      closeConfirmationModal();
    }
  });
}

// Helper: Show error under field
function showFieldError(inputElement, message) {
  inputElement.classList.add('is-invalid');
  const errorContainer = document.getElementById(`${inputElement.id}-error`);
  if (errorContainer) {
    errorContainer.textContent = message;
  }
}

// Helper: Clear field error
function clearFieldError(inputElement) {
  inputElement.classList.remove('is-invalid');
  const errorContainer = document.getElementById(`${inputElement.id}-error`);
  if (errorContainer) {
    errorContainer.textContent = '';
  }
}

// Helper: Format Date string nicely (e.g., "2026-09-20" -> "Sep 20, 2026")
function formatDateString(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/* ==========================================================================
   5. FAQ Accordion Toggle
   ========================================================================== */
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const faqItem = header.parentElement;
      const isOpen = faqItem.classList.contains('is-open');

      // Close all other open FAQ items
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('is-open');
          const toggleBtn = item.querySelector('.faq-header');
          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isOpen) {
        faqItem.classList.remove('is-open');
        header.setAttribute('aria-expanded', 'false');
      } else {
        faqItem.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   6. Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // Reveal once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   7. Active Navigation Link Highlighting on Scroll
   ========================================================================== */
function initActiveNavHighlighting() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 100;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}
