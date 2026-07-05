/* =========================================================
   SCRIPT HALAMAN UTAMA QR-ONE ARGOSARI
========================================================= */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const appState = {
  activeCategory: "semua",
  search: "",
  map: null,
  markers: new Map(),
  userMarker: null,
  sliderIndex: 0
};

function text(value) {
  return String(value ?? "");
}

function categoryLabel(categoryId) {
  return CATEGORIES.find((category) => category.id === categoryId)?.label || categoryId;
}

function detailUrl(destination) {
  return `detail.html?id=${encodeURIComponent(destination.id)}`;
}

function mapsSearchUrl(destination) {
  return `https://www.google.com/maps/search/?api=1&query=${destination.lat},${destination.lng}`;
}

function routeUrl(destination) {
  return `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`;
}

function whatsappUrl(customMessage = SITE_CONFIG.whatsappMessage) {
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(customMessage)}`;
}

function filteredDestinations() {
  const keyword = appState.search.trim().toLowerCase();
  return DESTINATIONS.filter((item) => {
    const matchCategory = appState.activeCategory === "semua" || item.category === appState.activeCategory;
    const haystack = `${item.title} ${item.summary} ${item.status} ${categoryLabel(item.category)}`.toLowerCase();
    const matchKeyword = !keyword || haystack.includes(keyword);
    return matchCategory && matchKeyword;
  });
}

function setupNavigation() {
  const toggle = $(".menu-toggle");
  const links = $("#navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  $$("a", links).forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function renderSlider() {
  const track = $("#sliderTrack");
  if (!track) return;

  track.innerHTML = DESTINATIONS.slice(0, 5).map((item, index) => `
    <article class="slide-card ${index === appState.sliderIndex ? "active" : ""}" data-slide="${index}">
      <img src="${text(item.image)}" alt="${text(item.title)}" />
      <span>${text(item.icon)} ${text(categoryLabel(item.category))}</span>
      <h3>${text(item.title)}</h3>
      <p>${text(item.summary)}</p>
    </article>
  `).join("");
}

function setupSlider() {
  const prev = $(".slider-btn.prev");
  const next = $(".slider-btn.next");
  const max = Math.min(DESTINATIONS.length, 5);
  if (!prev || !next || !max) return;

  const move = (direction) => {
    appState.sliderIndex = (appState.sliderIndex + direction + max) % max;
    renderSlider();
  };

  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  renderSlider();
}

function renderLegend() {
  const target = $("#legendList");
  if (!target) return;

  target.innerHTML = CATEGORIES.map((category) => `
    <button class="legend-item ${category.id === appState.activeCategory ? "active" : ""}" type="button" data-category="${text(category.id)}">
      <span>${text(category.icon)}</span>
      <strong>${text(category.label)}</strong>
    </button>
  `).join("");

  $$(".legend-item", target).forEach((button) => {
    button.addEventListener("click", () => {
      appState.activeCategory = button.dataset.category;
      renderLegend();
      renderDestinationCards();
      updateMarkers();
    });
  });
}

function renderDestinationCards() {
  const target = $("#destinationGrid");
  if (!target) return;

  const items = filteredDestinations();
  if (!items.length) {
    target.innerHTML = `<p class="empty-state">Data tidak ditemukan. Coba kata kunci atau kategori lain.</p>`;
    return;
  }

  target.innerHTML = items.map((item) => `
    <article class="tour-card">
      <div class="tour-image">
        <img src="${text(item.image)}" alt="${text(item.title)}" />
        <span class="tour-badge">${text(item.status)}</span>
      </div>
      <div class="tour-body">
        <p class="tour-category">${text(item.icon)} ${text(categoryLabel(item.category))}</p>
        <h3>${text(item.title)}</h3>
        <p>${text(item.summary)}</p>
        <div class="card-actions">
          <button class="btn btn-soft small" type="button" data-focus="${text(item.id)}">Lihat di Peta</button>
          <a class="btn btn-primary small" href="${detailUrl(item)}">Informasi lebih lanjut</a>
        </div>
      </div>
    </article>
  `).join("");

  $$('[data-focus]', target).forEach((button) => {
    button.addEventListener("click", () => focusDestination(button.dataset.focus));
  });
}

function renderImportantLinks() {
  const target = $("#importantLinks");
  if (!target) return;

  target.innerHTML = IMPORTANT_LINKS.map((link) => `
    <a class="info-link" href="${text(link.url)}" target="_blank" rel="noopener">
      <span class="info-icon">${text(link.icon)}</span>
      <strong>${text(link.title)}</strong>
      <p>${text(link.description)}</p>
      <em>Buka tautan →</em>
    </a>
  `).join("");
}

function markerHtml(item) {
  return `<div class="custom-marker marker-${text(item.category)}"><span>${text(item.icon)}</span></div>`;
}

function popupHtml(item) {
  return `
    <div class="popup-card">
      <strong>${text(item.title)}</strong>
      <p>${text(item.summary)}</p>
      <div class="popup-actions">
        <a href="${detailUrl(item)}">Detail</a>
        <a href="${routeUrl(item)}" target="_blank" rel="noopener">Rute</a>
      </div>
    </div>
  `;
}

function initMap() {
  const mapEl = $("#map");
  if (!mapEl || typeof L === "undefined") return;

  appState.map = L.map(mapEl, {
    scrollWheelZoom: true,
    zoomControl: true
  }).setView(SITE_CONFIG.mapCenter, SITE_CONFIG.mapZoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: SITE_CONFIG.tileAttribution
  }).addTo(appState.map);

  DESTINATIONS.forEach((item) => {
    const marker = L.marker([item.lat, item.lng], {
      title: item.title,
      icon: L.divIcon({
        html: markerHtml(item),
        className: "marker-shell",
        iconSize: [42, 42],
        iconAnchor: [21, 42],
        popupAnchor: [0, -40]
      })
    }).bindPopup(popupHtml(item));

    marker.addTo(appState.map);
    appState.markers.set(item.id, marker);
  });

  updateMarkers();
}

function updateMarkers() {
  if (!appState.map) return;
  const visible = filteredDestinations();
  const visibleIds = new Set(visible.map((item) => item.id));

  DESTINATIONS.forEach((item) => {
    const marker = appState.markers.get(item.id);
    if (!marker) return;
    if (visibleIds.has(item.id)) {
      if (!appState.map.hasLayer(marker)) marker.addTo(appState.map);
    } else if (appState.map.hasLayer(marker)) {
      appState.map.removeLayer(marker);
    }
  });

  if (visible.length) {
    const bounds = L.latLngBounds(visible.map((item) => [item.lat, item.lng]));
    appState.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }
}

function focusDestination(id) {
  const destination = DESTINATIONS.find((item) => item.id === id);
  const marker = appState.markers.get(id);
  if (!destination || !marker || !appState.map) return;

  appState.activeCategory = "semua";
  appState.search = "";
  const input = $("#searchInput");
  if (input) input.value = "";
  renderLegend();
  renderDestinationCards();
  updateMarkers();

  document.getElementById("peta")?.scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => {
    appState.map.setView([destination.lat, destination.lng], 16, { animate: true });
    marker.openPopup();
  }, 450);
}

function setupSearch() {
  const input = $("#searchInput");
  if (!input) return;

  input.addEventListener("input", () => {
    appState.search = input.value;
    renderDestinationCards();
    updateMarkers();
  });
}

function setupLocateButton() {
  const button = $("#locateBtn");
  if (!button) return;

  button.addEventListener("click", () => {
    if (!navigator.geolocation || !appState.map) {
      alert("Fitur lokasi belum tersedia di browser ini.");
      return;
    }

    button.textContent = "Mencari lokasi...";
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      if (appState.userMarker) appState.map.removeLayer(appState.userMarker);
      appState.userMarker = L.marker([latitude, longitude]).addTo(appState.map).bindPopup("Lokasi saya");
      appState.map.setView([latitude, longitude], 15);
      appState.userMarker.openPopup();
      button.textContent = "📍 Tampilkan lokasi saya";
    }, () => {
      alert("Lokasi tidak dapat diakses. Izinkan akses lokasi di browser lalu coba lagi.");
      button.textContent = "📍 Tampilkan lokasi saya";
    }, { enableHighAccuracy: true, timeout: 10000 });
  });
}

function setupContactLinks() {
  const mainUrl = whatsappUrl();
  ["waUpdate", "waFooter", "waMobile"].forEach((id) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.href = mainUrl;
  });
}

function boot() {
  setupNavigation();
  setupSlider();
  renderLegend();
  renderDestinationCards();
  renderImportantLinks();
  setupSearch();
  setupLocateButton();
  setupContactLinks();
  initMap();
}

document.addEventListener("DOMContentLoaded", boot);
