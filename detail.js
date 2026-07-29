/* =========================================================
   QR-ONE ARGOSARI — SCRIPT HALAMAN DETAIL / DIREKTORI
========================================================= */

"use strict";

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
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${Number(item.lat)},${Number(item.lng)}`)}`;
}

function mapEmbedUrl(item) {
  return `https://www.google.com/maps?q=${encodeURIComponent(`${Number(item.lat)},${Number(item.lng)}`)}&z=15&output=embed`;
}

function whatsappUrl(subject) {
  const message = `Halo Admin QR-ONE Argosari, saya ingin bertanya tentang ${subject}.`;
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return { id: params.get("id"), collection: params.get("collection") };
}

function renderList(items = []) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
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
            <a class="btn btn-primary" href="${escapeHtml(routeUrl(item))}" target="_blank" rel="noopener noreferrer">Buka Rute</a>
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
          <div class="detail-map">
            <iframe class="detail-map-frame" src="${escapeHtml(mapEmbedUrl(item))}" title="Peta ${escapeHtml(item.title)}" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
          <p class="map-note">Peta ditampilkan melalui Google Maps agar stabil pada GitHub Pages.</p>
          <a class="btn btn-soft full" href="${escapeHtml(whatsappUrl(item.title))}" target="_blank" rel="noopener noreferrer">Tanya Pengelola</a>
        </aside>
      </div>
    </section>`;

  setupImageFallback(root);
}

function renderCollection(collection) {
  const root = $detail("#detailRoot");
  document.title = `${collection.title} | QR-ONE ARGOSARI`;

  const meta = $detail("#detailMetaDescription");
  if (meta) meta.content = collection.summary;

  const places = Array.isArray(collection.places) ? collection.places : [];
  const totalLabel = `${places.length} ${places.length === 1 ? "tempat" : "tempat"}`;

  const cards = places.length
    ? places.map((place, index) => `
        <a
          class="place-card"
          href="${escapeHtml(place.mapUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Buka ${escapeHtml(place.name)} di Google Maps"
        >
          <span class="place-number">${String(index + 1).padStart(2, "0")}</span>

          <div class="place-card-content">
            <span class="place-type">${escapeHtml(place.type || categoryLabel(collection.category))}</span>
            <h3>${escapeHtml(place.name)}</h3>

            <p class="place-address">
              <strong>Alamat</strong>
              <span>${escapeHtml(place.address || "Alamat belum tersedia")}</span>
            </p>

            <span class="place-action">
              Buka di Google Maps
              <span aria-hidden="true">↗</span>
            </span>
          </div>
        </a>`).join("")
    : `<div class="directory-empty"><p>Daftar tempat belum tersedia.</p></div>`;

  root.innerHTML = `
    <section class="directory-hero" aria-labelledby="directoryTitle">
      <div class="container directory-hero-grid">
        <div>
          <p class="kicker">${escapeHtml(collection.icon)} ${escapeHtml(categoryLabel(collection.category))}</p>
          <h1 id="directoryTitle">${escapeHtml(collection.title)}</h1>
          <p class="hero-text">${escapeHtml(collection.summary)}</p>

          <div class="hero-actions">
            <a class="btn btn-primary" href="#daftarTempat">Lihat ${escapeHtml(totalLabel)}</a>
            <a class="btn btn-outline" href="${escapeHtml(whatsappUrl(collection.title))}" target="_blank" rel="noopener noreferrer">Tanya Pengelola</a>
          </div>
        </div>

        <img
          class="directory-image"
          src="${escapeHtml(collection.image)}"
          alt="Ilustrasi ${escapeHtml(collection.title)}"
          width="1000"
          height="750"
        />
      </div>
    </section>

    <section class="directory-section" id="daftarTempat" aria-labelledby="directoryListTitle">
      <div class="container">
        <div class="directory-heading">
          <p class="section-label">Daftar tempat</p>
          <h2 id="directoryListTitle">${escapeHtml(collection.title)} di Argosari</h2>
          <p>${escapeHtml(collection.intro)}</p>
          <span class="directory-count">${escapeHtml(totalLabel)}</span>
        </div>

        <div class="place-grid">${cards}</div>

        <p class="data-note">
          <strong>Sumber data:</strong>
          ${escapeHtml(collection.sourceNote || "Daftar tempat berasal dari data yang diberikan pengelola.")}
          Tombol lokasi membuka pencarian Google Maps berdasarkan nama dan alamat yang tercatat. Pastikan kembali posisi pin sebelum berangkat.
        </p>
      </div>
    </section>`;

  setupImageFallback(root);
}

function bootDetail() {
  const { id, collection } = getParams();

  if (collection) {
    const selectedCollection = SERVICE_COLLECTIONS.find((item) => item.id === collection);
    if (selectedCollection) return renderCollection(selectedCollection);
  }

  if (id) {
    const destination = DESTINATIONS.find((item) => item.id === id);
    if (destination) return renderDestination(destination);
  }

  renderNotFound();
}

document.addEventListener("DOMContentLoaded", bootDetail, { once: true });
