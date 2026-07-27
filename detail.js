/* =========================================================
   QR-ONE ARGOSARI — SCRIPT HALAMAN DETAIL / DIREKTORI
========================================================= */

const $detail = (selector, root = document) => root.querySelector(selector);

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

function routeUrl(item) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${item.lat},${item.lng}`)}`;
}

function whatsappUrl(subject) {
  const message = `Halo Admin QR-ONE Argosari, saya ingin bertanya tentang ${subject}.`;
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    id: params.get("id"),
    collection: params.get("collection")
  };
}

function renderList(items = []) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderNotFound() {
  const root = $detail("#detailRoot");
  document.title = "Data Tidak Ditemukan | QR-ONE ARGOSARI";
  root.innerHTML = `
    <section class="not-found">
      <div class="container not-found-card">
        <p class="section-label">Data tidak ditemukan</p>
        <h1>Halaman yang dibuka belum tersedia.</h1>
        <p>Periksa kembali tautan atau pilih informasi lain dari halaman utama.</p>
        <a class="btn btn-primary" href="./index.html#jelajahi">Kembali ke Jelajahi</a>
      </div>
    </section>`;
}

function renderDestination(item) {
  const root = $detail("#detailRoot");
  document.title = `${item.title} | QR-ONE ARGOSARI`;
  const meta = $detail("#detailMetaDescription");
  if (meta) meta.content = item.summary;

  root.innerHTML = `
    <section class="detail-hero" aria-labelledby="detailTitle">
      <div class="container detail-hero-grid">
        <div class="detail-hero-copy">
          <p class="kicker">${escapeHtml(item.icon)} ${escapeHtml(categoryLabel(item.category))}</p>
          <h1 id="detailTitle">${escapeHtml(item.title)}</h1>
          <p class="hero-text">${escapeHtml(item.summary)}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="${routeUrl(item)}" target="_blank" rel="noopener noreferrer">Buka Rute</a>
            <a class="btn btn-outline" href="./index.html#peta">Lihat Peta Utama</a>
          </div>
        </div>
        <img class="detail-image" src="${escapeHtml(item.image)}" alt="Foto ${escapeHtml(item.title)}" width="1000" height="750" />
      </div>
    </section>

    <section class="detail-content-section">
      <div class="container detail-layout">
        <article class="detail-main-card">
          <span class="chip">${escapeHtml(item.status)}</span>
          <h2>Tentang lokasi</h2>
          <p>${escapeHtml(item.description)}</p>

          <div class="info-grid">
            <div class="info-box"><h3>Waktu terbaik</h3><p>${escapeHtml(item.bestTime)}</p></div>
            <div class="info-box"><h3>Alamat atau posisi</h3><p>${escapeHtml(item.address)}</p></div>
          </div>

          <h3>Fasilitas dan layanan</h3>
          <ul class="check-list">${renderList(item.facilities)}</ul>
          <h3>Tips kunjungan</h3>
          <ul class="check-list">${renderList(item.tips)}</ul>
        </article>

        <aside class="detail-side-card">
          <h2>Lokasi pada peta</h2>
          <div id="detailMap" class="detail-map" aria-label="Peta lokasi ${escapeHtml(item.title)}"></div>
          <div id="detailMapFallback" class="detail-map-fallback" hidden>Peta tidak dapat dimuat. Gunakan tombol Buka Rute.</div>
          <p class="map-note">Gunakan peta atau tombol rute untuk menuju lokasi melalui aplikasi navigasi.</p>
          <a class="btn btn-soft full" href="${whatsappUrl(item.title)}" target="_blank" rel="noopener noreferrer">Tanya Pengelola</a>
        </aside>
      </div>
    </section>`;

  setupImageFallback(root);
  initDetailMap(item);
}

function renderCollection(collection) {
  const root = $detail("#detailRoot");
  document.title = `${collection.title} | QR-ONE ARGOSARI`;
  const meta = $detail("#detailMetaDescription");
  if (meta) meta.content = collection.summary;

  const places = collection.places || [];
  const cards = places.length
    ? places.map((place, index) => `
        <a class="place-card" href="${escapeHtml(place.mapUrl)}" target="_blank" rel="noopener noreferrer">
          <span class="place-number">${String(index + 1).padStart(2, "0")}</span>
          <div>
            <h3>${escapeHtml(place.name)}</h3>
            <p>${escapeHtml(place.description)}</p>
            <span class="place-action">Buka di Google Maps <span aria-hidden="true">↗</span></span>
          </div>
        </a>`).join("")
    : `<div class="directory-empty"><p>Daftar tempat belum diisi pada data.js.</p></div>`;

  root.innerHTML = `
    <section class="directory-hero">
      <div class="container directory-hero-grid">
        <div>
          <p class="kicker">${escapeHtml(collection.icon)} ${escapeHtml(categoryLabel(collection.category))}</p>
          <h1>${escapeHtml(collection.title)}</h1>
          <p class="hero-text">${escapeHtml(collection.summary)}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="./index.html#peta">Lihat Peta Utama</a>
            <a class="btn btn-outline" href="${whatsappUrl(collection.title)}" target="_blank" rel="noopener noreferrer">Tanya Pengelola</a>
          </div>
        </div>
        <img class="directory-image" src="${escapeHtml(collection.image)}" alt="Ilustrasi ${escapeHtml(collection.title)}" width="1000" height="750" />
      </div>
    </section>

    <section class="directory-section">
      <div class="container">
        <div class="directory-heading">
          <p class="section-label">Daftar tempat</p>
          <h2>Pilih lokasi yang ingin dibuka</h2>
          <p>${escapeHtml(collection.intro)}</p>
        </div>
        <div class="place-grid">${cards}</div>
        <p class="data-note"><strong>Catatan:</strong> daftar awal ini menggunakan hasil pencarian umum Google Maps. Ganti dengan nama dan tautan lokasi aktual pada bagian <code>SERVICE_COLLECTIONS</code> di <code>data.js</code>.</p>
      </div>
    </section>`;

  setupImageFallback(root);
}

function setupImageFallback(root = document) {
  root.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      if (image.dataset.fallbackApplied === "true") return;
      image.dataset.fallbackApplied = "true";
      image.src = SITE_CONFIG.fallbackImage;
    });
  });
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
  const { id, collection } = getParams();

  if (collection) {
    const selectedCollection = SERVICE_COLLECTIONS.find((item) => item.id === collection);
    if (selectedCollection) {
      renderCollection(selectedCollection);
      return;
    }
  }

  if (id) {
    const destination = DESTINATIONS.find((item) => item.id === id);
    if (destination) {
      renderDestination(destination);
      return;
    }
  }

  renderNotFound();
}

document.addEventListener("DOMContentLoaded", bootDetail, { once: true });
