/* ============================================================
   dashboard.js — Choose Macon 2030 Board Participation Tracker
   Data source: board_members.csv (edit that file to update)
   ============================================================ */

// Logo map: org name -> local file (falls back to initials)
const orgLogos = {
  "All-State Electrical":          "logos/all state.png",
  "Sheridan Construction":         "logos/sheridan.webp",
  "Cadence Bank":                  "logos/Cadence Bank.png",
  "H2 Capital":                    "logos/H2 Capital.png",
  "Terracon":                      "logos/terracon.webp",
  "Wesleyan College":              "logos/wesleyan.png",
  "Georgia Power":                 "logos/Georgia Power.png",
  "Piedmont Macon Medical Center": "logos/piedmont.png",
};

function getInitials(name) {
  return name.split(/\s+/).filter(w => /^[A-Za-z0-9]/.test(w)).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

// --- CSV parser (handles quoted fields with commas) ---
function parseCSVRow(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      inQuotes = !inQuotes;
    } else if (line[i] === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += line[i];
    }
  }
  result.push(current);
  return result;
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = parseCSVRow(lines[0]).map(h => h.trim());
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const values = parseCSVRow(line);
    const obj = {};
    headers.forEach((h, i) => obj[h] = (values[i] || '').trim());
    return obj;
  });
}

// --- Load CSV then build dashboard ---
fetch('board_members.csv')
  .then(r => r.text())
  .then(text => {
    const rows = parseCSV(text);
    const boardMembers = rows.map(r => ({
      org:         r['Organization'],
      contributed: r['Contributer'] === '1',
    }));
    initDashboard(boardMembers);
  })
  .catch(err => console.error('Failed to load board_members.csv:', err));

function initDashboard(boardMembers) {

  // --- Derived stats ---
  const total       = boardMembers.length;
  const contributed = boardMembers.filter(m => m.contributed).length;
  const percent     = contributed / total;

  // Unique contributing org names (deduplicated)
  const contributorOrgs = [...new Set(
    boardMembers.filter(m => m.contributed).map(m => m.org)
  )];

  // --- Populate stat cards ---
  document.getElementById('stat-total').textContent       = total;
  document.getElementById('stat-contributed').textContent = contributed;
  document.getElementById('stat-rate').textContent        = (percent * 100).toFixed(1) + '%';

  // --- Build contributor cards ---
  const list = document.getElementById('contributors-list');

  contributorOrgs.forEach((org, i) => {
    const card = document.createElement('div');
    card.className = 'contributor-card';
    card.style.transitionDelay = `${i * 70}ms`;

    const logoUrl  = orgLogos[org] || null;
    const initials = getInitials(org);
    const imgHtml  = logoUrl
      ? `<img src="${logoUrl}" alt="${org}" loading="lazy" onerror="this.style.display='none'">`
      : '';

    card.innerHTML =
      `<div class="org-logo">
         ${imgHtml}
         <span class="org-initials">${initials}</span>
         <div class="check-badge">
           <svg viewBox="0 0 12 12" fill="none">
             <polyline points="1.5,6.5 4.5,9.5 10.5,2.5"
                       stroke="#fff" stroke-width="2.5"
                       stroke-linecap="round" stroke-linejoin="round"/>
           </svg>
         </div>
       </div>
       <span class="contributor-name">${org}</span>`;

    list.appendChild(card);
  });

  // --- Scroll-triggered card reveals ---
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.contributor-card').forEach(card => {
    cardObserver.observe(card);
  });

  // --- Dial animation ---
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateDial() {
    const progress  = document.getElementById('dial-progress');
    const track     = document.getElementById('dial-track');
    const pctText   = document.getElementById('dial-pct-text');
    const arcLength = progress.getTotalLength();

    track.style.strokeDasharray  = arcLength;
    track.style.strokeDashoffset = '0';
    progress.style.strokeDasharray  = arcLength;
    progress.style.strokeDashoffset = arcLength;

    const targetOffset = arcLength * (1 - percent);
    const duration     = 1500;
    const start        = performance.now();

    function step(now) {
      const t      = Math.min((now - start) / duration, 1);
      const eased  = easeOutCubic(t);
      const offset = arcLength - eased * (arcLength - targetOffset);

      progress.style.strokeDashoffset = offset;
      pctText.textContent = (eased * percent * 100).toFixed(1) + '%';

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        pctText.textContent = (percent * 100).toFixed(1) + '%';
      }
    }

    requestAnimationFrame(step);
  }

  // --- Trigger dial when section scrolls into view ---
  const dialObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateDial();
        dialObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  dialObserver.observe(document.querySelector('.dial-section'));
}
