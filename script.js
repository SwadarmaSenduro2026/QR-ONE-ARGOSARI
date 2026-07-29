/* =========================================================
   QR-ONE ARGOSARI — SCRIPT HALAMAN UTAMA
   Peta memakai Google Maps Embed agar stabil di GitHub Pages.
========================================================= */

"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const state = {
  sliderIndex: 0,
  selectedMapId: null,
  mapLoadTimer: null
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
  return item.kind === "collection"
    ? `detail.html?collection=${encodeURIComponent(item.id)}`
    : `detail.html?id=${encodeURIComponent(item.id)}`;
}

function hasValidCoordinates(item) {
  const lat = Number(item?.lat);
  const lng = Number(item?.lng);
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function routeUrl(item) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${Number(item.lat)},${Number(item.lng)}`)}`;
}

function mapsSearchUrl(item) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${Number(item.lat)},${Number(item.lng)}`)}`;
}

function mapEmbedUrl(item) {
  return `https://www.google.com/maps?q=${encodeURIComponent(`${Number(item.lat)},${Number(item.lng)}`)}&z=15&output=embed`;
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
    if (SITE_CONFIG.fallbackImage) image.src = SITE_CONFIG.fallbackImage;
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
  if (!track || !dots || !Array.isArray(EXPLORE_ITEMS) || EXPLORE_ITEMS.length === 0) return;

  state.sliderIndex = (state.sliderIndex + EXPLORE_ITEMS.length) % EXPLORE_ITEMS.length;
  const item = EXPLORE_ITEMS[state.sliderIndex];
  const actionText = item.kind === "collection" ? "Buka daftar tempat" : "Lihat informasi lengkap";

  track.innerHTML = `
    <a class="explore-card" href="${escapeHtml(itemUrl(item))}" aria-label="${escapeHtml(actionText)}: ${escapeHtml(item.title)}">
      <div class="explore-image">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async" width="900" height="560" />
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
  if (!slider || !prev || !next || !Array.isArray(EXPLORE_ITEMS) || EXPLORE_ITEMS.length === 0) return;

  slider.tabIndex = 0;
  const move = (direction) => {
    state.sliderIndex = (state.sliderIndex + direction + EXPLORE_ITEMS.length) % EXPLORE_ITEMS.length;
    renderSlider();
  };

  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  slider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  });

  renderSlider();
}

function renderImportantLinks() {
  const target = $("#importantLinks");
  if (!target || !Array.isArray(IMPORTANT_LINKS)) return;

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

function setMapLoading(isLoading) {
  const loading = $("#mapLoading");
  if (!loading) return;
  loading.classList.toggle("hidden", !isLoading);
}

function focusDestination(id, scrollToMap = false) {
  const item = DESTINATIONS.find((destination) => destination.id === id && hasValidCoordinates(destination));
  if (!item) return;

  const frame = $("#argosariMapFrame");
  const fallback = $("#mapFallbackLink");
  const selectedTitle = $("#mapSelectedTitle");
  const selectedSummary = $("#mapSelectedSummary");
  const selectedDetail = $("#mapSelectedDetail");
  const selectedRoute = $("#mapSelectedRoute");

  state.selectedMapId = item.id;
  setMapLoading(true);

  if (frame) {
    frame.title = `Peta ${item.title}`;
    frame.src = mapEmbedUrl(item);
  }
  if (fallback) fallback.href = mapsSearchUrl(item);
  if (selectedTitle) selectedTitle.textContent = item.title;
  if (selectedSummary) selectedSummary.textContent = item.summary;
  if (selectedDetail) selectedDetail.href = itemUrl(item);
  if (selectedRoute) selectedRoute.href = routeUrl(item);

  $$('[data-map-place]').forEach((button) => {
    const active = button.dataset.mapPlace === item.id;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  window.clearTimeout(state.mapLoadTimer);
  state.mapLoadTimer = window.setTimeout(() => setMapLoading(false), 5000);

  if (scrollToMap) {
    $("#peta")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderMapPlaceList() {
  const list = $("#mapPlaceList");
  if (!list || !Array.isArray(DESTINATIONS)) return;

  const destinations = DESTINATIONS.filter(hasValidCoordinates);
  list.innerHTML = destinations.map((item) => `
    <button class="map-place-button" type="button" data-map-place="${escapeHtml(item.id)}" aria-pressed="false">
      <span class="map-place-icon" aria-hidden="true">${escapeHtml(item.icon)}</span>
      <span>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(categoryLabel(item.category))}</small>
      </span>
    </button>`).join("");

  $$('[data-map-place]', list).forEach((button) => {
    button.addEventListener("click", () => focusDestination(button.dataset.mapPlace, false));
  });

  if (destinations[0]) focusDestination(destinations[0].id, false);
}

function setupMapFrame() {
  const frame = $("#argosariMapFrame");
  if (!frame) return;
  frame.addEventListener("load", () => {
    window.clearTimeout(state.mapLoadTimer);
    setMapLoading(false);
  });
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
  setupMapFrame();
  renderMapPlaceList();
  setupContactLinks();
}

document.addEventListener("DOMContentLoaded", boot, { once: true });
