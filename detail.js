/* =========================================================
   QR-ONE ARGOSARI — SCRIPT HALAMAN DETAIL
========================================================= */

const $detail = (selector) => document.querySelector(selector);

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getDestination() {
  const id = new URLSearchParams(window.location.search).get("id") || "b29";
  return DESTINATIONS.find((item) => item.id === id);
}

function routeUrl(item) {
  return `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`;
}

function whatsappUrl(item) {
  const message = `Halo Admin QR-ONE Argosari, saya ingin bertanya tentang ${item.title}.`;
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function renderList(selector, items) {
  const target = $detail(selector);
  if (!target) return;
  target.innerHTML = (items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderNotFound() {
  const root = $detail("#detailRoot");
  if (!root) return;
  document.title = "Data Tidak Ditemukan | QR-ONE ARGOSARI";
  root.innerHTML = `
    <section class="detail-hero not-found">
      <div class="container">
        <p class="kicker">Data tidak ditemukan</p>
        <h1>Halaman destinasi belum tersedia.</h1>
        <p class="hero-text">Tautan yang dibuka mungkin tidak sesuai.</p>
        <a class="btn btn-primary" href="index.html#daftar">Kembali ke Daftar Destinasi</a>
      </div>
    </section>`;
}

function initDetailMap(item) {
  const element = $detail("#detailMap");
  const fallback = $detail("#detailMapFallback");
  if (!element || typeof window.L === "undefined") {
    if (element) element.hidden = true;
    if (fallback) fallback.hidden = false;
    return;
  }

  try {
    const map = L.map(element, { scrollWheelZoom: false, zoomControl: true }).setView([item.lat, item.lng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      minZoom: 3,
      maxZoom: 19,
      keepBuffer: 3,
      detectRetina: false,
      attribution: SITE_CONFIG.tileAttribution
    }).addTo(map);
    L.marker([item.lat, item.lng]).addTo(map).bindPopup(`<strong>${escapeHtml(item.title)}</strong>`).openPopup();

    const refresh = () => map.invalidateSize({ pan: false, animate: false });
    map.whenReady(() => window.setTimeout(refresh, 80));
    window.addEventListener("resize", () => window.setTimeout(refresh, 120), { passive: true });
  } catch (error) {
    console.error("Peta detail gagal dimuat:", error);
    element.hidden = true;
    if (fallback) fallback.hidden = false;
  }
}

function bootDetail() {
  const item = getDestination();
  if (!item) {
    renderNotFound();
    return;
  }

  document.title = `${item.title} | QR-ONE ARGOSARI`;
  const meta = $detail("#detailMetaDescription");
  if (meta) meta.content = item.summary;

  $detail("#detailCategory").textContent = `${item.icon} ${CATEGORIES[item.category] || item.category}`;
  $detail("#detailTitle").textContent = item.title;
  $detail("#detailSummary").textContent = item.summary;
  $detail("#detailStatus").textContent = item.status;
  $detail("#detailDescription").textContent = item.description;
  $detail("#detailBestTime").textContent = item.bestTime;
  $detail("#detailAddress").textContent = item.address;
  $detail("#routeButton").href = routeUrl(item);
  $detail("#waAsk").href = whatsappUrl(item);

  const image = $detail("#detailImage");
  image.src = item.image;
  image.alt = `Foto ${item.title}`;
  image.addEventListener("error", () => {
    if (image.dataset.fallbackApplied === "true") return;
    image.dataset.fallbackApplied = "true";
    image.src = SITE_CONFIG.fallbackImage;
  });

  renderList("#facilityList", item.facilities);
  renderList("#tipsList", item.tips);
  initDetailMap(item);
}

document.addEventListener("DOMContentLoaded", bootDetail, { once: true });
