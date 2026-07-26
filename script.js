/* =========================================================
   QR-ONE ARGOSARI — SCRIPT HALAMAN UTAMA
   Peta sengaja dibuat sederhana agar ringan dan stabil.
========================================================= */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const state = {
  map: null,
  markerGroup: null,
  markers: new Map(),
  sliderIndex: 0,
  resizeTimer: null
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function categoryLabel(id) {
  return CATEGORIES[id] || id;
}

function detailUrl(item) {
  return `detail.html?id=${encodeURIComponent(item.id)}`;
}

function routeUrl(item) {
  return `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`;
}

function whatsappUrl(message = SITE_CONFIG.whatsappMessage) {
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function setupImageFallbacks() {
  document.addEventListener("error", (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement)) return;
    if (image.dataset.fallbackApplied === "true") return;
    image.dataset.fallbackApplied = "true";
    image.src = SITE_CONFIG.fallbackImage;
  }, true);
}

function setupNavigation() {
  const toggle = $(".menu-toggle");
  const links = $("#navLinks");
  if (!toggle || !links) return;

  const closeMenu = () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  $$("a", links).forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function renderSlider() {
  const track = $("#sliderTrack");
  if (!track || DESTINATIONS.length === 0) return;
  const item = DESTINATIONS[state.sliderIndex % DESTINATIONS.length];

  track.innerHTML = `
    <article class="slide-card">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" width="900" height="560" />
      <div class="slide-content">
        <span>${escapeHtml(item.icon)} ${escapeHtml(categoryLabel(item.category))}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        <a href="${detailUrl(item)}">Lihat informasi →</a>
      </div>
    </article>`;
}

function setupSlider() {
  const prev = $(".slider-btn.prev");
  const next = $(".slider-btn.next");
  if (!prev || !next || DESTINATIONS.length === 0) return;

  const move = (direction) => {
    state.sliderIndex = (state.sliderIndex + direction + DESTINATIONS.length) % DESTINATIONS.length;
    renderSlider();
  };

  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  renderSlider();
}

function renderDestinationCards() {
  const grid = $("#destinationGrid");
  if (!grid) return;

  grid.innerHTML = DESTINATIONS.map((item) => `
    <article class="tour-card">
      <div class="tour-image">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" width="900" height="560" />
        <span class="tour-badge">${escapeHtml(item.status)}</span>
      </div>
      <div class="tour-body">
        <p class="tour-category">${escapeHtml(item.icon)} ${escapeHtml(categoryLabel(item.category))}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        <div class="card-actions">
          <button class="btn btn-soft small" type="button" data-focus-map="${escapeHtml(item.id)}">Lihat di Peta</button>
          <a class="btn btn-primary small" href="${detailUrl(item)}">Informasi Lengkap</a>
        </div>
      </div>
    </article>`).join("");

  $$('[data-focus-map]', grid).forEach((button) => {
    button.addEventListener("click", () => focusDestination(button.dataset.focusMap, true));
  });
}

function renderImportantLinks() {
  const grid = $("#importantLinks");
  if (!grid) return;

  grid.innerHTML = IMPORTANT_LINKS.map((link) => `
    <a class="info-link" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
      <span class="info-icon">${escapeHtml(link.icon)}</span>
      <strong>${escapeHtml(link.title)}</strong>
      <p>${escapeHtml(link.description)}</p>
      <em>Buka informasi →</em>
    </a>`).join("");
}

function popupHtml(item) {
  return `
    <div class="map-popup">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.summary)}</p>
      <div class="map-popup-actions">
        <a href="${detailUrl(item)}">Detail</a>
        <a href="${routeUrl(item)}" target="_blank" rel="noopener noreferrer">Buka Rute</a>
      </div>
    </div>`;
}

function renderMapPlaceList() {
  const list = $("#mapPlaceList");
  if (!list) return;

  list.innerHTML = DESTINATIONS.map((item) => `
    <button class="map-place-button" type="button" data-map-place="${escapeHtml(item.id)}">
      <span class="map-place-icon">${escapeHtml(item.icon)}</span>
      <span>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(categoryLabel(item.category))}</small>
      </span>
    </button>`).join("");

  $$('[data-map-place]', list).forEach((button) => {
    button.addEventListener("click", () => focusDestination(button.dataset.mapPlace, false));
  });
}

function showMapError(message) {
  const box = $("#mapError");
  if (!box) return;
  if (message) box.textContent = message;
  box.hidden = false;
}

function refreshMap(delay = 0) {
  if (!state.map) return;
  window.clearTimeout(state.resizeTimer);
  state.resizeTimer = window.setTimeout(() => {
    state.map.invalidateSize({ pan: false, animate: false });
  }, delay);
}

function initMap() {
  const mapElement = document.getElementById("argosariMap");
  if (!mapElement) return;
  if (typeof window.L === "undefined") {
    showMapError("Leaflet tidak dapat dimuat. Periksa koneksi internet lalu muat ulang halaman.");
    return;
  }

  try {
    state.map = L.map(mapElement, {
      center: SITE_CONFIG.mapCenter,
      zoom: SITE_CONFIG.mapZoom,
      zoomControl: true,
      scrollWheelZoom: false,
      doubleClickZoom: true,
      dragging: true,
      keyboard: true,
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
      inertia: true
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      minZoom: 3,
      maxZoom: 19,
      keepBuffer: 3,
      detectRetina: false,
      attribution: SITE_CONFIG.tileAttribution
    }).addTo(state.map);

    state.markerGroup = L.featureGroup().addTo(state.map);

    DESTINATIONS.forEach((item) => {
      const marker = L.marker([item.lat, item.lng], { title: item.title, riseOnHover: true })
        .bindPopup(popupHtml(item), { maxWidth: 300, autoPan: true, autoPanPadding: [24, 24] })
        .addTo(state.markerGroup);
      state.markers.set(item.id, marker);
    });

    const bounds = state.markerGroup.getBounds();
    if (bounds.isValid()) {
      state.map.fitBounds(bounds, { padding: [36, 36], maxZoom: 14, animate: false });
    }

    state.map.whenReady(() => refreshMap(50));
    requestAnimationFrame(() => requestAnimationFrame(() => refreshMap(0)));
    window.setTimeout(() => refreshMap(0), 300);
  } catch (error) {
    console.error("Peta gagal dibuat:", error);
    showMapError("Peta gagal dibuat. Muat ulang halaman atau periksa Console browser.");
  }
}

function focusDestination(id, scrollToMap = true) {
  const item = DESTINATIONS.find((destination) => destination.id === id);
  const marker = state.markers.get(id);
  if (!item || !marker || !state.map) return;

  if (scrollToMap) {
    document.getElementById("peta")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  window.setTimeout(() => {
    refreshMap(0);
    state.map.flyTo([item.lat, item.lng], 16, { animate: true, duration: 0.7 });
    window.setTimeout(() => marker.openPopup(), 720);
  }, scrollToMap ? 450 : 0);
}

function setupMapRefresh() {
  let timer;
  window.addEventListener("resize", () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => refreshMap(0), 180);
  }, { passive: true });

  window.addEventListener("orientationchange", () => refreshMap(280), { passive: true });
  $$('a[href="#peta"]').forEach((link) => link.addEventListener("click", () => refreshMap(450)));
  if (document.fonts?.ready) document.fonts.ready.then(() => refreshMap(60));
  if (window.location.hash === "#peta") refreshMap(300);
}

function setupContactLinks() {
  const url = whatsappUrl();
  ["waUpdate", "waFooter", "waMobile"].forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.href = url;
  });
}

function boot() {
  setupImageFallbacks();
  setupNavigation();
  setupSlider();
  renderDestinationCards();
  renderImportantLinks();
  renderMapPlaceList();
  setupContactLinks();
  initMap();
  setupMapRefresh();
}

document.addEventListener("DOMContentLoaded", boot, { once: true });
