/* ============================================================
   dashboard.js — Choose Macon 2030 Board Participation Tracker
   ============================================================ */

const boardMembers = [
  { org: "All-State Electrical",                         contributed: true  },
  { org: "Sheridan Construction",                        contributed: true  },
  { org: "Jones Cork, LLP",                              contributed: false },
  { org: "Cadence Bank",                                 contributed: true  },
  { org: "Wesleyan College",                             contributed: true  },
  { org: "Stafford Builders and Consultants Inc",        contributed: false },
  { org: "H2 Capital",                                   contributed: true  },
  { org: "The Miner Agency",                             contributed: false },
  { org: "Brookdale Resource Center",                    contributed: false },
  { org: "Macon-Bibb Co. Industrial Authority",          contributed: false },
  { org: "Wesley Glen Ministries",                       contributed: false },
  { org: "Atrium Health Navicent",                       contributed: false },
  { org: "Cohens Consulting",                            contributed: false },
  { org: "Robins Financial Credit Union",                contributed: false },
  { org: "Piedmont Macon Medical Center",                contributed: false },
  { org: "Dunwody Design Development",                   contributed: false },
  { org: "Mercer University",                            contributed: false },
  { org: "ASTRE Wellness",                               contributed: false },
  { org: "Macon-Bibb Co. Industrial Authority",          contributed: false },
  { org: "Theatre Macon",                                contributed: false },
  { org: "COX",                                          contributed: false },
  { org: "NewTown Macon",                                contributed: false },
  { org: "Prince Service & Manufacturing",               contributed: false },
  { org: "Terracon",                                     contributed: true  },
  { org: "Atlanta Gas Light Company",                    contributed: false },
  { org: "YKK Corp",                                     contributed: false },
  { org: "Robins Air Force Base, 78th Air Base Wing",    contributed: false },
  { org: "Fickling & Company, Inc.",                     contributed: false },
  { org: "The Peyton Anderson Foundation",               contributed: false },
  { org: "Bibb Mt. Zion Baptist Church",                 contributed: false },
  { org: "Middle Georgia Regional Commission",           contributed: false },
  { org: "Macon-Bibb County",                            contributed: false },
  { org: "Urban Development Authority",                  contributed: false },
  { org: "Macon Coca-Cola Bottling Co.",                 contributed: false },
  { org: "Piedmont Macon Medical Center",                contributed: true  },
  { org: "NotiVision",                                   contributed: false },
  { org: "Piedmont Occupation Medicine",                 contributed: false },
  { org: "SPINEN",                                       contributed: false },
  { org: "Hutchings Funeral Home, Inc.",                 contributed: false },
  { org: "Georgia Power",                                contributed: true  },
  { org: "Ocmulgee National Park & Preserve Initiative", contributed: false },
  { org: "Macon-Bibb County",                            contributed: false },
  { org: "Truist Bank",                                  contributed: false },
  { org: "Bibb County School District",                  contributed: false },
  { org: "21st Century Partnership",                     contributed: false },
  { org: "Bibb Distributing",                            contributed: false },
  { org: "Macon Water Authority",                        contributed: false },
  { org: "Visit Macon",                                  contributed: false },
  { org: "Unified Defense",                              contributed: false },
  { org: "Community Foundation of Central Georgia",      contributed: false },
  { org: "YKK AP",                                       contributed: false },
];

// --- Derived stats ---
const total       = boardMembers.length;
const contributed = boardMembers.filter(m => m.contributed).length;
const percent     = contributed / total;

// Unique org names for contributors (deduplicated)
const contributorOrgs = [...new Set(
  boardMembers.filter(m => m.contributed).map(m => m.org)
)];

// Logo URLs for contributing orgs
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

// --- Dial animation ---
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateDial() {
  const progress  = document.getElementById('dial-progress');
  const track     = document.getElementById('dial-track');
  const pctText   = document.getElementById('dial-pct-text');
  const arcLength = progress.getTotalLength();

  // Set up track (always fully visible)
  track.style.strokeDasharray  = arcLength;
  track.style.strokeDashoffset = '0';

  // Progress starts fully hidden
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

// --- Trigger dial when the section scrolls into view ---
const dialObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateDial();
      dialObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

dialObserver.observe(document.querySelector('.dial-section'));
