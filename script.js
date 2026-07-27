/* =========================================================
   QR-ONE ARGOSARI — SCRIPT HALAMAN UTAMA
========================================================= */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const state = {
  sliderIndex: 0,
  map: null,
  markerGroup: null,
  markers: new Map(),
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

function categoryLabel(category) {
  return CATEGORIES[category] || category || "Informasi";
}

function itemUrl(item) {
  if (item.kind === "collection") {
    return `detail.html?collection=${encodeURIComponent(item.id)}`;
  }
  return `detail.html?id=${encodeURIComponent(item.id)}`;
}

function routeUrl(item) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${item.lat},${item.lng}`)}`;
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
  const dots = $("#sliderDots");
  if (!track || !dots || EXPLORE_ITEMS.length === 0) return;

  const item = EXPLORE_ITEMS[state.sliderIndex % EXPLORE_ITEMS.length];
  const actionText = item.kind === "collection" ? "Buka daftar tempat" : "Lihat informasi lengkap";

  track.innerHTML = `
    <a class="explore-card" href="${itemUrl(item)}" aria-label="${escapeHtml(actionText)}: ${escapeHtml(item.title)}">
      <div class="explore-image">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" width="900" height="560" />
        <span class="explore-badge">${escapeHtml(item.status)}</span>
      </div>
      <div class="explore-content">
        <span class="explore-category">${escapeHtml(item.icon)} ${escapeHtml(categoryLabel(item.category))}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        <span class="explore-action">${escapeHtml(actionText)} <span aria-hidden="true">→</span></span>
      </div>
    </a>`;

  dots.innerHTML = EXPLORE_ITEMS.map((entry, index) => `
    <button class="slider-dot${index === state.sliderIndex ? " active" : ""}" type="button" data-slide-index="${index}" aria-label="Tampilkan ${escapeHtml(entry.title)}" aria-current="${index === state.sliderIndex ? "true" : "false"}"></button>`).join("");

  $$('[data-slide-index]', dots).forEach((button) => {
    button.addEventListener("click", () => {
      state.sliderIndex = Number(button.dataset.slideIndex);
      renderSlider();
    });
  });
}

function setupSlider() {
  const slider = $(".explore-slider");
  const prev = $(".slider-btn.prev");
  const next = $(".slider-btn.next");
  if (!slider || !prev || !next || EXPLORE_ITEMS.length === 0) return;

  const move = (direction) => {
    state.sliderIndex = (state.sliderIndex + direction + EXPLORE_ITEMS.length) % EXPLORE_ITEMS.length;
    renderSlider();
  };

  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  slider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });

  renderSlider();
}

function renderImportantLinks() {
  const target = $("#importantLinks");
  if (!target) return;

  target.innerHTML = IMPORTANT_LINKS.map((link) => `
    <a class="info-link" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" aria-label="Buka ${escapeHtml(link.title)}">
      <div class="info-illustration">
        <img src="${escapeHtml(link.image)}" alt="${escapeHtml(link.imageAlt || link.title)}" width="80" height="80" loading="lazy" decoding="async" />
      </div>
      <strong>${escapeHtml(link.title)}</strong>
      <p>${escapeHtml(link.description)}</p>
      <span class="info-link-action">Buka informasi <span aria-hidden="true">→</span></span>
    </a>`).join("");
}

function popupHtml(item) {
  return `
    <div class="map-popup">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.summary)}</p>
      <div class="map-popup-actions">
        <a href="${itemUrl(item)}">Detail</a>
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
  const mapElement = $("#argosariMap");
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

    state.map.whenReady(() => refreshMap(60));
    requestAnimationFrame(() => requestAnimationFrame(() => refreshMap(0)));
    window.setTimeout(() => refreshMap(0), 320);
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
    $("#peta")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
  $$('#navLinks a[href="#peta"], .hero-actions a[href="#peta"], .mobile-nav a[href="#peta"]').forEach((link) => {
    link.addEventListener("click", () => refreshMap(450));
  });
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
  renderImportantLinks();
  renderMapPlaceList();
  setupContactLinks();
  initMap();
  setupMapRefresh();
}

document.addEventListener("DOMContentLoaded", boot, { once: true });
