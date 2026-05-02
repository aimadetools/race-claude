/**
 * PricePulse Sticky CTA Banner
 * Injected into all company/comparison pages.
 * Shows a persistent bottom bar encouraging visitors to sign up.
 * Dismissed state persisted in localStorage.
 */
(function () {
  'use strict';

  // Don't show if already dismissed in this browser
  if (localStorage.getItem('pp-cta-dismissed') === '1') return;

  // Don't double-inject
  if (document.getElementById('pp-cta-banner')) return;

  var path = window.location.pathname;
  var pageSlug = path.split('/').pop().replace('.html', '') || 'page';

  // Detect page type for slightly tailored messaging
  var isVsPage = path.indexOf('-vs-') !== -1;
  var isFreePage = path.indexOf('free-alternatives') !== -1;

  var headline = isFreePage
    ? 'Get alerted when free plans disappear'
    : isVsPage
    ? 'Get alerted when either tool changes pricing'
    : 'Know instantly when this pricing changes';

  var signupUrl =
    '/signup.html?utm_source=company_page&utm_medium=cta_banner&utm_content=' +
    encodeURIComponent(pageSlug);

  var banner = document.createElement('div');
  banner.id = 'pp-cta-banner';
  banner.setAttribute('role', 'complementary');
  banner.setAttribute('aria-label', 'PricePulse pricing alert signup');

  banner.style.cssText = [
    'position:fixed',
    'bottom:0',
    'left:0',
    'right:0',
    'z-index:99999',
    'background:linear-gradient(135deg,#0f1117 0%,#1a1a2e 100%)',
    'border-top:1px solid rgba(0,229,160,0.25)',
    'padding:0.875rem 1.25rem',
    'display:flex',
    'align-items:center',
    'justify-content:space-between',
    'gap:0.75rem',
    'box-shadow:0 -4px 32px rgba(0,0,0,0.5)',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
  ].join(';');

  banner.innerHTML =
    '<div style="display:flex;align-items:center;gap:0.75rem;flex:1;min-width:0;">' +
      '<span style="font-size:1.375rem;flex-shrink:0;" aria-hidden="true">📡</span>' +
      '<div style="min-width:0;">' +
        '<div style="color:#e8e8f0;font-weight:600;font-size:0.9375rem;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' +
          headline +
        '</div>' +
        '<div style="color:#8888a8;font-size:0.8125rem;margin-top:0.1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' +
          'PricePulse monitors pricing pages 24/7 &mdash; free plan, no credit card.' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div style="display:flex;align-items:center;gap:0.625rem;flex-shrink:0;">' +
      '<a href="' + signupUrl + '" ' +
         'style="background:#00e5a0;color:#0a0a0f;padding:0.5rem 1.125rem;border-radius:8px;font-weight:700;font-size:0.875rem;text-decoration:none;white-space:nowrap;transition:opacity 0.15s;"' +
         'onmouseover="this.style.opacity=\'0.85\'"' +
         'onmouseout="this.style.opacity=\'1\'">' +
        'Try Free &rarr;' +
      '</a>' +
      '<button ' +
        'onclick="document.getElementById(\'pp-cta-banner\').style.display=\'none\';localStorage.setItem(\'pp-cta-dismissed\',\'1\');" ' +
        'style="background:none;border:none;color:#8888a8;cursor:pointer;font-size:1.375rem;line-height:1;padding:0.25rem;flex-shrink:0;" ' +
        'aria-label="Dismiss banner">' +
        '&times;' +
      '</button>' +
    '</div>';

  // Wait for DOM ready before injecting
  function inject() {
    if (document.body) {
      document.body.appendChild(banner);
      // Add bottom padding to body so page content isn't hidden behind banner
      var existing = document.body.style.paddingBottom;
      if (!existing || existing === '0px' || existing === '') {
        document.body.style.paddingBottom = '68px';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
