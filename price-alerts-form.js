// price-alerts-form.js — Handle pricing alerts signup form on company pages
// Collects email for visitors interested in price change notifications

(function() {
  // Get tool name from page URL or fallback to page title
  function getToolName() {
    const path = window.location.pathname;
    const match = path.match(/companies\/(.+?)-pricing/);
    if (match) {
      // Convert slug to title case: "slack-pricing" → "Slack"
      return match[1]
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    // Fallback to h1 text if we can extract a company name
    const h1 = document.querySelector('h1');
    if (h1) {
      const text = h1.textContent;
      const match2 = text.match(/^(.+?)\s+(Pricing|pricing)/);
      return match2 ? match2[1] : text;
    }
    return 'Unknown Tool';
  }

  // Create the form element
  function createForm() {
    const toolName = getToolName();
    const formHTML = `
      <div style="background: rgba(0,229,160,0.05); border: 1px solid rgba(0,229,160,0.2); border-radius: 12px; padding: 1.5rem; margin: 2.5rem 0;">
        <h3 style="font-size: 1.125rem; margin-bottom: 0.75rem; color: #e8e8f0;">Get ${toolName} Price Change Alerts</h3>
        <p style="color: #8888a8; margin-bottom: 1.25rem; font-size: 0.9375rem;">We'll email you when ${toolName} changes pricing. No spam, just alerts.</p>
        <form id="price-alerts-form" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
            style="flex: 1; min-width: 200px; padding: 0.75rem 1rem; border: 1px solid #2a2a3d; border-radius: 8px; background: #12121a; color: #e8e8f0; font-size: 0.9375rem;"
          />
          <button
            type="submit"
            style="padding: 0.75rem 1.5rem; background: #00e5a0; color: #0a0a0f; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9375rem;"
          >
            Notify Me
          </button>
        </form>
        <p id="alerts-message" style="display: none; margin-top: 0.75rem; font-size: 0.875rem; margin-bottom: 0;"></p>
      </div>
    `;
    return formHTML;
  }

  // Insert form into the page (before the footer calculator CTA)
  function insertForm() {
    const formHTML = createForm();
    const calculatorCTA = document.querySelector('section:has(.cta-box)') ||
                         document.querySelector('section:last-of-type');

    if (calculatorCTA && calculatorCTA !== document.querySelector('footer')) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = formHTML;
      calculatorCTA.parentNode.insertBefore(wrapper.firstElementChild, calculatorCTA);
    } else {
      // Fallback: insert before footer
      const footer = document.querySelector('footer');
      if (footer) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = formHTML;
        footer.parentNode.insertBefore(wrapper.firstElementChild, footer);
      }
    }
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('price-alerts-form');
    const email = form.querySelector('input[name="email"]').value;
    const toolName = getToolName();
    const messageEl = document.getElementById('alerts-message');

    // Validate email
    if (!email || !email.includes('@')) {
      messageEl.style.display = 'block';
      messageEl.style.color = '#ff6b6b';
      messageEl.textContent = 'Please enter a valid email.';
      return;
    }

    // Show loading state
    messageEl.style.display = 'block';
    messageEl.style.color = '#8888a8';
    messageEl.textContent = 'Signing up...';
    const button = form.querySelector('button');
    button.disabled = true;
    button.style.opacity = '0.6';

    // Send to API
    fetch('/api/price-alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, tool_name: toolName })
    })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        messageEl.style.color = '#00e5a0';
        messageEl.textContent = '✓ You\'ll get alerts when ' + toolName + ' changes pricing.';
        form.reset();
      } else {
        messageEl.style.color = '#ff6b6b';
        messageEl.textContent = data.error || 'Something went wrong. Please try again.';
      }
    })
    .catch(err => {
      console.error('Alert signup error:', err);
      messageEl.style.color = '#ff6b6b';
      messageEl.textContent = 'Network error. Please try again.';
    })
    .finally(() => {
      button.disabled = false;
      button.style.opacity = '1';
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      insertForm();
      const form = document.getElementById('price-alerts-form');
      if (form) form.addEventListener('submit', handleSubmit);
    });
  } else {
    insertForm();
    const form = document.getElementById('price-alerts-form');
    if (form) form.addEventListener('submit', handleSubmit);
  }
})();
