/* =========================================================
   SCRIPT HALAMAN DETAIL QR-ONE ARGOSARI
========================================================= */

const qs = (
  selector,
  parent = document
) => parent.querySelector(selector);

function getDestinationId() {
  const params =
    new URLSearchParams(
      window.location.search
    );

  return (
    params.get("id") ||
    "b29"
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCategoryLabel(categoryId) {
  const category =
    CATEGORIES.find(
      (item) =>
        item.id === categoryId
    );

  return category
    ? `${category.icon} ${category.label}`
    : categoryId;
}

function makeRouteUrl(item) {
  return (
    "https://www.google.com/maps/dir/?api=1" +
    `&destination=${item.lat},${item.lng}`
  );
}

function makeWhatsappUrl(item) {
  const message =
    `Halo Admin QR-ONE Argosari, ` +
    `saya ingin bertanya tentang ${item.title}.`;

  return (
    `https://wa.me/${SITE_CONFIG.whatsappNumber}` +
    `?text=${encodeURIComponent(message)}`
  );
}

function renderList(
  targetId,
  items
) {
  const target =
    qs(`#${targetId}`);

  if (!target) {
    return;
  }

  target.innerHTML =
    (items || [])
      .map(
        (item) =>
          `<li>${escapeHtml(item)}</li>`
      )
      .join("");
}

function renderNotFound() {
  const root =
    qs("#detailRoot");

  if (!root) {
    return;
  }

  document.title =
    "Data Tidak Ditemukan | QR-ONE ARGOSARI";

  root.innerHTML = `
    <section class="detail-hero not-found">
      <div class="container">
        <p class="kicker">
          Data tidak ditemukan
        </p>

        <h1>
          Halaman destinasi belum tersedia.
        </h1>

        <p class="hero-text">
          Tautan yang dibuka mungkin tidak sesuai.
          Silakan kembali dan pilih destinasi lain.
        </p>

        <a
          class="btn btn-primary"
          href="index.html#daftar"
        >
          Kembali ke Daftar Destinasi
        </a>
      </div>
    </section>
  `;
}

function setupImageFallback() {
  const image =
    qs("#detailImage");

  if (!image) {
    return;
  }

  image.addEventListener(
    "error",
    () => {
      if (
        image.dataset
          .fallbackApplied === "true"
      ) {
        return;
      }

      image.dataset
        .fallbackApplied = "true";

      image.src =
        SITE_CONFIG.fallbackImage;
    }
  );
}

function showDetailMapFallback() {
  const mapElement =
    qs("#detailMap");

  const fallback =
    qs("#detailMapFallback");

  if (mapElement) {
    mapElement.hidden = true;
  }

  if (fallback) {
    fallback.hidden = false;
  }
}

function initDetailMap(item) {
  const mapElement =
    qs("#detailMap");

  if (
    !mapElement ||
    typeof window.L === "undefined"
  ) {
    showDetailMapFallback();
    return;
  }

  try {
    const map = L.map(
      mapElement,
      {
        scrollWheelZoom: false,
        zoomControl: true,
        preferCanvas: true
      }
    ).setView(
      [item.lat, item.lng],
      15
    );

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,

        attribution:
          SITE_CONFIG.tileAttribution
      }
    ).addTo(map);

    L.marker(
      [item.lat, item.lng]
    )
      .addTo(map)
      .bindPopup(
        `
          <strong>
            ${escapeHtml(item.title)}
          </strong>
          <br>
          ${escapeHtml(item.summary)}
        `
      )
      .openPopup();

    const refresh = () => {
      map.invalidateSize({
        pan: false,
        animate: false
      });
    };

    map.whenReady(() => {
      window.setTimeout(
        refresh,
        100
      );
    });

    window.addEventListener(
      "load",
      () => {
        window.setTimeout(
          refresh,
          160
        );
      }
    );

    window.addEventListener(
      "resize",
      () => {
        window.setTimeout(
          refresh,
          100
        );
      }
    );

    window.addEventListener(
      "orientationchange",
      () => {
        window.setTimeout(
          refresh,
          220
        );
      }
    );

    if (
      "ResizeObserver" in window
    ) {
      const observer =
        new ResizeObserver(() => {
          window.setTimeout(
            refresh,
            60
          );
        });

      observer.observe(
        mapElement
      );
    }
  } catch (error) {
    console.error(
      "Peta detail gagal dimuat:",
      error
    );

    showDetailMapFallback();
  }
}

function bootDetail() {
  setupImageFallback();

  const id =
    getDestinationId();

  const item =
    DESTINATIONS.find(
      (destination) =>
        destination.id === id
    );

  if (!item) {
    renderNotFound();
    return;
  }

  document.title =
    `${item.title} | QR-ONE ARGOSARI`;

  const metaDescription =
    qs("#detailMetaDescription");

  if (metaDescription) {
    metaDescription.content =
      item.summary;
  }

  qs("#detailCategory")
    .textContent =
      getCategoryLabel(
        item.category
      );

  qs("#detailTitle")
    .textContent =
      item.title;

  qs("#detailSummary")
    .textContent =
      item.summary;

  qs("#detailImage")
    .src =
      item.image ||
      SITE_CONFIG.fallbackImage;

  qs("#detailImage")
    .alt =
      `Gambar ${item.title}`;

  qs("#detailStatus")
    .textContent =
      item.status;

  qs("#detailDescription")
    .textContent =
      item.description;

  qs("#detailBestTime")
    .textContent =
      item.bestTime;

  qs("#detailAddress")
    .textContent =
      item.address;

  qs("#routeButton")
    .href =
      makeRouteUrl(item);

  qs("#waAsk")
    .href =
      makeWhatsappUrl(item);

  renderList(
    "facilityList",
    item.facilities
  );

  renderList(
    "tipsList",
    item.tips
  );

  initDetailMap(item);
}

document.addEventListener(
  "DOMContentLoaded",
  bootDetail
);
