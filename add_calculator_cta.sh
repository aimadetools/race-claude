#!/bin/bash

# Get all individual pricing pages without the CTA
pages=$(for f in companies/*-pricing.html; do 
  if [[ ! "$f" =~ "vs-" ]]; then 
    if ! grep -q "Compare Your Entire SaaS Stack" "$f"; then 
      echo "$f"
    fi
  fi
done)

total=$(echo "$pages" | wc -l)
count=0

for page in $pages; do
  # Extract company name from filename (e.g., adobe-creative-cloud-pricing.html -> Adobe Creative Cloud)
  filename=$(basename "$page" -pricing.html)
  company=$(echo "$filename" | sed 's/-/ /g' | sed 's/\b\(.\)/\U\1/g')
  
  # Check if footer exists
  if grep -q "</footer>" "$page"; then
    # Create the CTA section with the company name
    cta_section="<section style=\"max-width: 860px; margin: 3rem auto 0; padding: 0 1.5rem;\">
  <div style=\"background: linear-gradient(135deg, rgba(0,229,160,0.08), rgba(0,184,122,0.04)); border: 1px solid rgba(0,229,160,0.25); border-radius: 12px; padding: 2rem; text-align: center;\">
    <h2 style=\"color: var(--text); font-size: 1.25rem; margin-bottom: 0.75rem;\">Compare Your Entire SaaS Stack</h2>
    <p style=\"color: #8888a8; margin-bottom: 1.5rem; max-width: 520px; margin-left: auto; margin-right: auto;\">Use our interactive SaaS Pricing Calculator to see what your team's entire toolstack costs with $company and 35+ other tools. Get instant cost breakdowns by team size.</p>
    <a href=\"/saas-pricing-calculator.html\" style=\"display: inline-block; background: #00e5a0; color: #0a0a0f; font-weight: 700; padding: 0.75rem 1.75rem; border-radius: 8px; font-size: 1rem; text-decoration: none;\">Try the Calculator Free →</a>
  </div>
</section>

"
    
    # Insert before footer using sed
    sed -i "/<footer>/i $cta_section" "$page"
    
    count=$((count + 1))
    echo "[$count/$total] Added CTA to $page"
  else
    echo "SKIP: No footer found in $page"
  fi
done

echo ""
echo "✅ Added calculator CTA to $count pages"
