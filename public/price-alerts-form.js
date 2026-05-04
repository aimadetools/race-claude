// price-alerts-form.js — Price change alert signup form for company pricing pages

(function() {
  // Configuration
  const API_ENDPOINT = '/api/price-alerts';
  const FORM_ID = 'price-alerts-form';

  // Extract tool name from page URL or heading
  function getToolName() {
    // Try URL path first: /companies/slack-pricing.html → "Slack"
    const urlMatch = window.location.pathname.match(/\/companies\/(.+?)-pricing\.html/);
    if (urlMatch) {
      const slug = urlMatch[1];
      // Convert slug to title case: slack → Slack, microsoft-teams → Microsoft Teams
      return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    // Fallback: extract from page h1 text
    const h1 = document.querySelector('h1');
    if (h1) {
      const text = h1.textContent;
      // Extract tool name: "Slack Pricing Plans 2026" → "Slack"
      const match = text.match(/^([^()]+?)\s+(Pricing|Plans)/i);
      if (match) return match[1].trim();
    }

    return 'this tool';
  }

  // Create and inject the form HTML
  function createFormHTML(toolName) {
    return `
      <div id="${FORM_ID}-container" style="
        background: linear-gradient(135deg, rgba(0,229,160,.08), rgba(0,184,122,.04));
        border: 1px solid rgba(0,229,160,.25);
        border-radius: 12px;
        padding: 1.5rem;
        margin: 2rem 0;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
      ">
        <h3 style="
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: #e8e8f0;
        ">
          Get ${toolName} Price Change Alerts
        </h3>
        <p style="
          color: #8888a8;
          font-size: 0.9375rem;
          margin: 0 0 1rem 0;
        ">
          We'll email you when ${toolName} changes their pricing. No spam, we promise.
        </p>

        <form id="${FORM_ID}" style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <input
            type="email"
            id="${FORM_ID}-email"
            placeholder="your@email.com"
            required
            style="
              flex: 1;
              min-width: 200px;
              padding: 0.625rem 1rem;
              background: rgba(255,255,255,.08);
              border: 1px solid rgba(0,229,160,.25);
              border-radius: 8px;
              color: #e8e8f0;
              font-size: 0.9375rem;
              font-family: inherit;
            "
          />
          <button
            type="submit"
            id="${FORM_ID}-submit"
            style="
              padding: 0.625rem 1.5rem;
              background: #00e5a0;
              color: #0a0a0f;
              font-weight: 600;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 0.9375rem;
              font-family: inherit;
              transition: background 0.2s;
            "
          >
            Get alerts
          </button>
        </form>

        <div id="${FORM_ID}-status" style="
          margin-top: 0.75rem;
          font-size: 0.875rem;
          display: none;
        "></div>
      </div>
    `;
  }

  // Find the insertion point
  function findInsertionPoint() {
    // Look for a section to insert before (e.g., footer, related links, etc.)
    const footer = document.querySelector('footer');
    const lastSection = document.querySelector('.section:last-of-type');

    if (lastSection && footer) {
      // Insert before footer, after last content section
      return { parent: footer.parentElement, insertBefore: footer };
    } else if (footer) {
      return { parent: footer.parentElement, insertBefore: footer };
    } else if (lastSection) {
      // If no footer, insert after last section
      return { parent: lastSection.parentElement, insertAfter: lastSection };
    }

    // Fallback: append to body
    return { parent: document.body, insertBefore: null };
  }

  // Initialize form
  function init() {
    const toolName = getToolName();
    const { parent, insertBefore, insertAfter } = findInsertionPoint();

    // Create wrapper div
    const wrapper = document.createElement('div');
    wrapper.innerHTML = createFormHTML(toolName);

    // Insert into DOM
    if (insertBefore) {
      parent.insertBefore(wrapper.firstElementChild, insertBefore);
    } else if (insertAfter) {
      if (insertAfter.nextSibling) {
        parent.insertBefore(wrapper.firstElementChild, insertAfter.nextSibling);
      } else {
        parent.appendChild(wrapper.firstElementChild);
      }
    } else if (parent) {
      parent.appendChild(wrapper.firstElementChild);
    }

    // Attach event listeners
    const form = document.getElementById(FORM_ID);
    const emailInput = document.getElementById(`${FORM_ID}-email`);
    const submitBtn = document.getElementById(`${FORM_ID}-submit`);
    const statusDiv = document.getElementById(`${FORM_ID}-status`);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      if (!email) return;

      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      statusDiv.textContent = '';
      statusDiv.style.display = 'none';

      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, tool_name: toolName })
        });

        const data = await response.json();

        if (response.ok && data.ok) {
          // Success
          statusDiv.style.color = '#00e5a0';
          statusDiv.textContent = `✓ ${data.message}`;
          statusDiv.style.display = 'block';
          form.style.display = 'none';
        } else {
          // Error
          statusDiv.style.color = '#ff9f9f';
          statusDiv.textContent = `✗ ${data.error || 'Something went wrong. Please try again.'}`;
          statusDiv.style.display = 'block';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Get alerts';
        }
      } catch (err) {
        console.error('[price-alerts] Error:', err);
        statusDiv.style.color = '#ff9f9f';
        statusDiv.textContent = '✗ Network error. Please check your connection and try again.';
        statusDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get alerts';
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
