/**
 * PricePulse Exit Intent Popup
 * Captures emails when users try to leave without signing up.
 * Complementary to cta.js (banner) and inline-cta.js (post-pricing table)
 */
(function () {
  'use strict';

  // Don't show if already dismissed in this session
  if (sessionStorage.getItem('pp-exit-dismissed') === '1') return;

  // Don't double-inject
  if (document.getElementById('pp-exit-popup')) return;

  var mousedownY = 0;
  var isPointerAboveViewport = false;

  // Track mouse position to detect exit intent
  document.addEventListener('mouseleave', function (e) {
    // Only trigger on mouse leave near top of window (desktop only)
    if (e.clientY <= 0) {
      showExitPopup();
    }
  });

  // On mobile, also trigger on scroll to top
  var lastScrollY = window.scrollY;
  window.addEventListener('scroll', function () {
    if (window.scrollY < lastScrollY && window.scrollY < 200) {
      // Scrolling up, near top
      if (!isPointerAboveViewport) {
        lastScrollY = window.scrollY;
      }
    }
    lastScrollY = window.scrollY;
  });

  function showExitPopup() {
    if (isPointerAboveViewport || document.getElementById('pp-exit-popup')) return;
    isPointerAboveViewport = true;

    var path = window.location.pathname;
    var pageSlug = path.split('/').pop().replace('.html', '') || 'page';

    var popup = document.createElement('div');
    popup.id = 'pp-exit-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', 'PricePulse early access offer');

    // Overlay
    var overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'right:0',
      'bottom:0',
      'background:rgba(0,0,0,0.6)',
      'z-index:99998',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'backdrop-filter:blur(4px)',
      'animation:fadeIn 0.2s ease-out'
    ].join(';');

    // Modal
    var modal = document.createElement('div');
    modal.style.cssText = [
      'background:#0a0a0f',
      'border:1px solid rgba(0,229,160,0.25)',
      'border-radius:16px',
      'padding:2rem',
      'max-width:420px',
      'width:90vw',
      'max-height:85vh',
      'overflow:auto',
      'position:relative',
      'box-shadow:0 20px 60px rgba(0,0,0,0.8)',
      'animation:slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
    ].join(';');

    // Add animations
    var style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      #pp-exit-form input { box-sizing: border-box; }
    `;
    document.head.appendChild(style);

    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = [
      'position:absolute',
      'top:1rem',
      'right:1rem',
      'background:none',
      'border:none',
      'color:#8888a8',
      'font-size:1.75rem',
      'cursor:pointer',
      'padding:0',
      'width:2rem',
      'height:2rem',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'transition:color 0.15s'
    ].join(';');
    closeBtn.onmouseover = function () { this.style.color = '#e8e8f0'; };
    closeBtn.onmouseout = function () { this.style.color = '#8888a8'; };
    closeBtn.onclick = function () { dismissPopup(); };

    var headline = document.createElement('h2');
    headline.textContent = "Don't miss the next price hike";
    headline.style.cssText = [
      'font-size:1.5rem',
      'font-weight:700',
      'color:#e8e8f0',
      'margin:0 0 0.75rem 0',
      'line-height:1.2'
    ].join(';');

    var subtext = document.createElement('p');
    subtext.innerHTML = 'Get notified the instant any tool in your stack changes pricing. Early access opens May 15th.';
    subtext.style.cssText = [
      'color:#8888a8',
      'font-size:0.9375rem',
      'margin:0 0 1.5rem 0',
      'line-height:1.5'
    ].join(';');

    var form = document.createElement('form');
    form.id = 'pp-exit-form';
    form.onsubmit = function (e) {
      e.preventDefault();
      var email = emailInput.value.trim();
      if (!email) return;
      // Track early access signup
      var signupUrl = '/signup.html?utm_source=exit_intent&utm_content=' +
        encodeURIComponent(pageSlug) + '&email=' + encodeURIComponent(email);
      window.location.href = signupUrl;
    };

    var emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.placeholder = 'your@email.com';
    emailInput.required = true;
    emailInput.style.cssText = [
      'width:100%',
      'padding:0.75rem 1rem',
      'border:1px solid rgba(0,229,160,0.25)',
      'border-radius:8px',
      'background:#12121a',
      'color:#e8e8f0',
      'font-family:inherit',
      'font-size:0.9375rem',
      'margin-bottom:1rem',
      'transition:border-color 0.15s'
    ].join(';');
    emailInput.onfocus = function () { this.style.borderColor = 'rgba(0,229,160,0.6)'; };
    emailInput.onblur = function () { this.style.borderColor = 'rgba(0,229,160,0.25)'; };

    var submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Get Early Access →';
    submitBtn.style.cssText = [
      'width:100%',
      'padding:0.875rem 1.5rem',
      'background:#00e5a0',
      'color:#0a0a0f',
      'border:none',
      'border-radius:8px',
      'font-weight:700',
      'font-size:0.9375rem',
      'cursor:pointer',
      'transition:opacity 0.15s'
    ].join(';');
    submitBtn.onmouseover = function () { this.style.opacity = '0.85'; };
    submitBtn.onmouseout = function () { this.style.opacity = '1'; };

    var disclaimer = document.createElement('p');
    disclaimer.textContent = 'No spam, unsubscribe anytime. We\'ll notify you when early access opens.';
    disclaimer.style.cssText = [
      'font-size:0.75rem',
      'color:#6666888',
      'margin:0.75rem 0 0 0',
      'text-align:center'
    ].join(';');

    form.appendChild(emailInput);
    form.appendChild(submitBtn);
    form.appendChild(disclaimer);

    modal.appendChild(closeBtn);
    modal.appendChild(headline);
    modal.appendChild(subtext);
    modal.appendChild(form);

    overlay.appendChild(modal);
    popup.appendChild(overlay);

    // Prevent body scroll
    var originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.body.appendChild(popup);

    // Close on overlay click
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) dismissPopup();
    });

    // Close on escape key
    var escapeHandler = function (e) {
      if (e.key === 'Escape') dismissPopup();
    };
    document.addEventListener('keydown', escapeHandler);

    function dismissPopup() {
      popup.remove();
      style.remove();
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', escapeHandler);
      sessionStorage.setItem('pp-exit-dismissed', '1');
      isPointerAboveViewport = false;
    }

    // Auto-focus email input
    emailInput.focus();
  }
})();
