/* =========================================================
   SCRIPT HALAMAN DETAIL QR-ONE ARGOSARI
========================================================= */

const qs = (selector, parent = document) => parent.querySelector(selector);

function getDestinationId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "b29";
}

function safe(value) {
  return String(value ?? "");
}

function getCategoryLabel(categoryId) {
  const category = CATEGORIES.find((item) => item.id === categoryId);
  return category ? `${category.icon} ${category.label}` : categoryId;
}

function makeRouteUrl(item) {
  return `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`;
}

function makeWhatsappUrl(item) {
  const message = `Halo Admin QR-ONE Argosari, saya ingin bertanya tentang ${item.title}.`;
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function renderList(targetId, items) {
  const target = qs(`#${targetId}`);
  if (!target) return;
  target.innerHTML = (items || []).map((item) => `<li>${safe(item)}</li>`).join("");
}

function renderNotFound() {
  const root = qs("#detailRoot");
  if (!root) return;
  root.innerHTML = `
    <section class="detail-hero">
      <div class="container">
        <p class="kicker">Data tidak ditemukan</p>
        <h1>Halaman wisata belum tersedia.</h1>
        <p class="hero-text">Silakan kembali ke daftar wisata dan pilih destinasi lain.</p>
        <a class="btn btn-primary" href="index.html#daftar">Kembali ke Daftar Wisata</a>
      </div>
    </section>
  `;
}

function initDetailMap(item) {
  const mapEl = qs("#detailMap");
  if (!mapEl || typeof L === "undefined") return;

  const map = L.map(mapEl, {
    scrollWheelZoom: true,
    zoomControl: true
  }).setView([item.lat, item.lng], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: SITE_CONFIG.tileAttribution
  }).addTo(map);

  L.marker([item.lat, item.lng]).addTo(map).bindPopup(`<strong>${safe(item.title)}</strong><br>${safe(item.summary)}`).openPopup();
}

function bootDetail() {
  const id = getDestinationId();
  const item = DESTINATIONS.find((destination) => destination.id === id);
  if (!item) {
    renderNotFound();
    return;
  }

  document.title = `${item.title} | QR-ONE ARGOSARI`;
  qs("#detailCategory").textContent = getCategoryLabel(item.category);
  qs("#detailTitle").textContent = item.title;
  qs("#detailSummary").textContent = item.summary;
  qs("#detailImage").src = item.image || "assets/hero-argosari.svg";
  qs("#detailImage").alt = item.title;
  qs("#detailStatus").textContent = item.status;
  qs("#detailDescription").textContent = item.description;
  qs("#detailBestTime").textContent = item.bestTime;
  qs("#detailAddress").textContent = item.address;
  qs("#routeButton").href = makeRouteUrl(item);
  qs("#waAsk").href = makeWhatsappUrl(item);

  renderList("facilityList", item.facilities);
  renderList("tipsList", item.tips);
  initDetailMap(item);
}

document.addEventListener("DOMContentLoaded", bootDetail);
