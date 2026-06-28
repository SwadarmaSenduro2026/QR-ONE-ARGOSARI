const $ = (selector) => document.querySelector(selector);

function setText(selector, value) {
  const el = $(selector);
  if (el && value) el.textContent = value;
}

function safeLink(url) {
  return url && url.trim() ? url : '#';
}

function buildWhatsAppUrl() {
  if (!CONFIG.whatsapp || !CONFIG.whatsapp.number) return '#kontak';
  const number = String(CONFIG.whatsapp.number).replace(/\D/g, '');
  const message = encodeURIComponent(CONFIG.whatsapp.message || 'Halo Admin QR-One Argosari.');
  return `https://wa.me/${number}?text=${message}`;
}

function renderConfig() {
  setText('#brandTitle', CONFIG.site.navTitle);
  setText('#brandMark', CONFIG.logos.navText);
  setText('#siteEyebrow', CONFIG.site.eyebrow);
  setText('#siteTitle', CONFIG.site.title);
  setText('#siteSubtitle', CONFIG.site.subtitle);
  setText('#noticeText', CONFIG.site.notice);
  setText('#quickTitle', CONFIG.site.quickTitle);
  setText('#quickIntro', CONFIG.site.quickIntro);
  setText('#mapDescription', CONFIG.map.description);
  setText('#contactDescription', CONFIG.contact.description);
  setText('#formTitle', CONFIG.form.title);
  setText('#formDescription', CONFIG.form.description);
  setText('#footerTitle', CONFIG.site.navTitle);
  setText('#footerText', CONFIG.site.footer);
  setText('#lastUpdated', CONFIG.site.lastUpdated);

  const mapButton = $('#mapButton');
  if (mapButton) mapButton.href = safeLink(CONFIG.map.mapButtonUrl);

  const whatsappUrl = buildWhatsAppUrl();

  const contactButton = $('#contactButton');
  if (contactButton) {
    contactButton.href = safeLink(CONFIG.contact.buttonUrl) === '#'? whatsappUrl : safeLink(CONFIG.contact.buttonUrl);
    contactButton.textContent = CONFIG.contact.buttonText || 'Chat WhatsApp';
    contactButton.target = '_blank';
    contactButton.rel = 'noopener';
  }

  const whatsappFloat = $('#whatsappFloat');
  if (whatsappFloat) {
    whatsappFloat.href = whatsappUrl;
    whatsappFloat.setAttribute('aria-label', CONFIG.whatsapp?.ariaLabel || 'Hubungi via WhatsApp');
    const label = whatsappFloat.querySelector('.wa-label');
    if (label) label.textContent = CONFIG.whatsapp?.floatText || 'WhatsApp';
  }

  const formButton = $('#formButton');
  if (formButton) {
    if (CONFIG.form.url && CONFIG.form.url.trim()) {
      formButton.href = CONFIG.form.url;
      formButton.textContent = CONFIG.form.activeText;
      formButton.target = '_blank';
      formButton.rel = 'noopener';
      formButton.removeAttribute('aria-disabled');
    } else {
      formButton.href = '#update';
      formButton.textContent = CONFIG.form.inactiveText;
      formButton.setAttribute('aria-disabled', 'true');
    }
  }
}

function renderStats() {
  const grid = $('#statsGrid');
  if (!grid) return;
  grid.innerHTML = CONFIG.stats.map(item => `
    <div class="stat"><strong>${item.value}</strong><span>${item.label}</span></div>
  `).join('');
}

function createMenuCard(item) {
  const a = document.createElement('a');
  a.className = 'menu-card';
  a.href = safeLink(item.link);
  a.dataset.search = `${item.title} ${item.shortTitle || ''} ${item.description || ''}`.toLowerCase();
  a.innerHTML = `
    <span class="icon" aria-hidden="true">${item.icon || '📌'}</span>
    <span>
      <h3>${item.title}</h3>
      <p>${item.description || ''}</p>
      <span class="status">${item.status || 'Info'}</span>
    </span>
    <span class="arrow" aria-hidden="true">›</span>
  `;
  return a;
}

function renderMenu() {
  const grid = $('#menuGrid');
  if (!grid) return;
  grid.innerHTML = '';
  MENU_ITEMS.forEach(item => grid.appendChild(createMenuCard(item)));
}

function renderLegend() {
  const legend = $('#mapLegend');
  if (legend) legend.innerHTML = CONFIG.map.legend.map(item => `<span>${item}</span>`).join('');

  const frame = $('#mapFrame');
  if (frame && CONFIG.map.embedUrl && CONFIG.map.embedUrl.trim()) {
    frame.innerHTML = `<iframe class="map-embed" title="Peta QR-One Argosari" src="${CONFIG.map.embedUrl}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  }
}

function renderDestinations() {
  const grid = $('#destinationGrid');
  if (!grid) return;
  grid.innerHTML = DESTINATIONS.map(item => `
    <article class="destination-card">
      <div class="destination-image" aria-hidden="true">${item.icon}</div>
      <span class="tag">${item.tag}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
      <span class="destination-meta">${item.meta}</span>
    </article>
  `).join('');
}

function renderFacilities() {
  const list = $('#facilityList');
  if (!list) return;
  list.innerHTML = FACILITIES.map(item => `<span>${item}</span>`).join('');
}

function renderGuides() {
  const grid = $('#guideGrid');
  if (!grid) return;
  grid.innerHTML = GUIDES.map(item => `
    <article class="guide-card">
      <span class="guide-icon" aria-hidden="true">${item.icon}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join('');
}

function setupSearch() {
  const input = $('#searchInput');
  const empty = $('#emptyState');
  if (!input) return;
  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    const cards = Array.from(document.querySelectorAll('.menu-card'));
    let visibleCount = 0;
    cards.forEach(card => {
      const matches = card.dataset.search.includes(query);
      card.hidden = !matches;
      if (matches) visibleCount++;
    });
    if (empty) empty.hidden = visibleCount > 0;
  });
}

renderConfig();
renderStats();
renderMenu();
renderLegend();
renderDestinations();
renderFacilities();
renderGuides();
setupSearch();
