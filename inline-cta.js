/**
 * PricePulse Inline CTA
 * Injected into all company/comparison pages.
 * Shows a CTA box immediately after the pricing table.
 */
(function () {
  'use strict';

  // Don't double-inject
  if (document.getElementById('pp-inline-cta')) return;

  var path = window.location.pathname;
  var pageSlug = path.split('/').pop().replace('.html', '') || 'page';

  // Detect page type
  var isVsPage = path.indexOf('-vs-') !== -1;
  var isFreePage = path.indexOf('free-alternatives') !== -1;

  var headline = isFreePage
    ? 'Never miss when free plans change'
    : isVsPage
    ? 'Track both tools automatically'
    : 'Get price alerts for this tool';

  var subtext = isFreePage
    ? 'Get notified the moment these free options disappear or change.'
    : isVsPage
    ? 'We monitor pricing pages 24/7 and alert you to changes instantly.'
    : 'Stop manually checking. We monitor this pricing page 24/7 for you.';

  var signupUrl =
    '/signup.html?utm_source=inline_cta&utm_medium=pricing_table&utm_content=' +
    encodeURIComponent(pageSlug);

  var ctaBox = document.createElement('div');
  ctaBox.id = 'pp-inline-cta';
  ctaBox.setAttribute('role', 'complementary');
  ctaBox.setAttribute('aria-label', 'PricePulse inline pricing alert signup');

  ctaBox.style.cssText = [
    'background:linear-gradient(135deg,rgba(0,229,160,0.08),rgba(0,184,122,0.04))',
    'border:1px solid rgba(0,229,160,0.25)',
    'border-radius:12px',
    'padding:1.5rem',
    'text-align:center',
    'margin:1.75rem 0',
    'max-width:600px',
  ].join(';');

  ctaBox.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:center;gap:0.75rem;margin-bottom:0.75rem;">' +
      '<span style="font-size:1.5rem;" aria-hidden="true">📡</span>' +
      '<h3 style="font-size:1.25rem;font-weight:700;margin:0;color:#e8e8f0;">' +
        headline +
      '</h3>' +
    '</div>' +
    '<p style="color:#8888a8;font-size:0.9375rem;line-height:1.6;margin:0 0 1.25rem 0;max-width:520px;margin-left:auto;margin-right:auto;">' +
      subtext +
    '</p>' +
    '<a href="' + signupUrl + '" ' +
       'style="display:inline-block;background:#00e5a0;color:#0a0a0f;font-weight:700;padding:0.75rem 1.75rem;border-radius:8px;font-size:1rem;text-decoration:none;transition:opacity 0.15s;cursor:pointer;"' +
       'onmouseover="this.style.opacity=\'0.85\'"' +
       'onmouseout="this.style.opacity=\'1\'">' +
      'Set up free alerts' +
    '</a>' +
    '<p style="color:#6666888;font-size:0.8125rem;margin-top:1rem;margin-bottom:0;">No credit card required • Free plan forever</p>';

  // Find the first pricing table and inject after it
  function inject() {
    var pricingTable = document.querySelector('.pricing-table');
    if (!pricingTable) return; // No pricing table found

    var parent = pricingTable.parentNode;
    pricingTable.parentNode.insertBefore(ctaBox, pricingTable.nextSibling);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
