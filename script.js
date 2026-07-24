/* =========================================================
   QR-ONE ARGOSARI
   Script halaman utama dengan peta Leaflet sederhana
========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];


/* =========================================================
   STATUS APLIKASI
========================================================= */

const appState = {
  map: null,
  markerLayer: null,
  markers: new Map(),
  sliderIndex: 0,
  resizeTimer: null
};


/* =========================================================
   FUNGSI DASAR
========================================================= */

function text(value) {
  return String(value ?? "");
}


function categoryLabel(categoryId) {
  return (
    CATEGORIES.find(
      (category) => category.id === categoryId
    )?.label || categoryId
  );
}


function detailUrl(destination) {
  return (
    `detail.html?id=${encodeURIComponent(destination.id)}`
  );
}


function routeUrl(destination) {
  return (
    "https://www.google.com/maps/dir/?api=1" +
    `&destination=${destination.lat},${destination.lng}`
  );
}


function whatsappUrl(
  customMessage = SITE_CONFIG.whatsappMessage
) {
  return (
    `https://wa.me/${SITE_CONFIG.whatsappNumber}` +
    `?text=${encodeURIComponent(customMessage)}`
  );
}


/* =========================================================
   GAMBAR CADANGAN
========================================================= */

function setupImageFallbacks() {
  document.addEventListener(
    "error",
    (event) => {
      const image = event.target;

      if (!(image instanceof HTMLImageElement)) {
        return;
      }

      if (image.dataset.fallbackApplied === "true") {
        return;
      }

      image.dataset.fallbackApplied = "true";

      image.src =
        SITE_CONFIG.fallbackImage ||
        "assets/hero-argosari.svg";
    },
    true
  );
}


/* =========================================================
   NAVIGASI
========================================================= */

function setupNavigation() {
  const toggle = $(".menu-toggle");
  const links = $("#navLinks");

  if (!toggle || !links) {
    return;
  }

  function closeMenu() {
    links.classList.remove("open");

    toggle.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  toggle.addEventListener("click", () => {
    const isOpen =
      links.classList.toggle("open");

    toggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });

  $$("a", links).forEach((link) => {
    link.addEventListener(
      "click",
      closeMenu
    );
  });

  document.addEventListener(
    "click",
    (event) => {
      if (!links.classList.contains("open")) {
        return;
      }

      if (
        links.contains(event.target) ||
        toggle.contains(event.target)
      ) {
        return;
      }

      closeMenu();
    }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    }
  );
}


/* =========================================================
   SLIDER TENTANG ARGOSARI
========================================================= */

function renderSlider() {
  const track = $("#sliderTrack");

  if (!track) {
    return;
  }

  const items = DESTINATIONS.slice(0, 5);

  const currentItem =
    items[appState.sliderIndex];

  if (!currentItem) {
    track.innerHTML = "";
    return;
  }

  track.innerHTML = `
    <article class="slide-card active">
      <img
        src="${text(currentItem.image)}"
        alt="${text(currentItem.title)}"
        loading="lazy"
      />

      <div class="slide-content">
        <span>
          ${text(currentItem.icon)}
          ${text(categoryLabel(currentItem.category))}
        </span>

        <h3>
          ${text(currentItem.title)}
        </h3>

        <p>
          ${text(currentItem.summary)}
        </p>

        <a href="${detailUrl(currentItem)}">
          Lihat informasi →
        </a>
      </div>
    </article>
  `;
}


function setupSlider() {
  const previousButton =
    $(".slider-btn.prev");

  const nextButton =
    $(".slider-btn.next");

  const itemCount =
    Math.min(DESTINATIONS.length, 5);

  if (
    !previousButton ||
    !nextButton ||
    itemCount === 0
  ) {
    return;
  }

  function moveSlider(direction) {
    appState.sliderIndex =
      (
        appState.sliderIndex +
        direction +
        itemCount
      ) % itemCount;

    renderSlider();
  }

  previousButton.addEventListener(
    "click",
    () => moveSlider(-1)
  );

  nextButton.addEventListener(
    "click",
    () => moveSlider(1)
  );

  renderSlider();
}


/* =========================================================
   DAFTAR DESTINASI
========================================================= */

function renderDestinationCards() {
  const target =
    $("#destinationGrid");

  if (!target) {
    return;
  }

  target.innerHTML = DESTINATIONS.map(
    (item) => `
      <article class="tour-card">
        <div class="tour-image">
          <img
            src="${text(item.image)}"
            alt="${text(item.title)}"
            loading="lazy"
          />

          <span class="tour-badge">
            ${text(item.status)}
          </span>
        </div>

        <div class="tour-body">
          <p class="tour-category">
            ${text(item.icon)}
            ${text(categoryLabel(item.category))}
          </p>

          <h3>
            ${text(item.title)}
          </h3>

          <p>
            ${text(item.summary)}
          </p>

          <div class="card-actions">
            <button
              class="btn btn-soft small"
              type="button"
              data-focus-map="${text(item.id)}"
            >
              Lihat di Peta
            </button>

            <a
              class="btn btn-primary small"
              href="${detailUrl(item)}"
            >
              Informasi Lengkap
            </a>
          </div>
        </div>
      </article>
    `
  ).join("");

  $$("[data-focus-map]", target).forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          focusDestination(
            button.dataset.focusMap
          );
        }
      );
    }
  );
}


/* =========================================================
   TAUTAN INFORMASI
========================================================= */

function renderImportantLinks() {
  const target =
    $("#importantLinks");

  if (!target) {
    return;
  }

  target.innerHTML = IMPORTANT_LINKS.map(
    (link) => `
      <a
        class="info-link"
        href="${text(link.url)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="info-icon">
          ${text(link.icon)}
        </span>

        <strong>
          ${text(link.title)}
        </strong>

        <p>
          ${text(link.description)}
        </p>

        <em>
          Buka informasi →
        </em>
      </a>
    `
  ).join("");
}


/* =========================================================
   POPUP PETA
========================================================= */

function popupHtml(item) {
  return `
    <div class="simple-popup">
      <strong>
        ${text(item.title)}
      </strong>

      <p>
        ${text(item.summary)}
      </p>

      <div class="simple-popup-actions">
        <a href="${detailUrl(item)}">
          Detail
        </a>

        <a
          href="${routeUrl(item)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buka Rute
        </a>
      </div>
    </div>
  `;
}


/* =========================================================
   LEGENDA DESTINASI PETA
========================================================= */

function renderMapPlaceList() {
  const target =
    $("#mapPlaceList");

  if (!target) {
    return;
  }

  target.innerHTML = DESTINATIONS.map(
    (item) => `
      <button
        class="map-place-button"
        type="button"
        data-map-place="${text(item.id)}"
      >
        <span class="map-place-icon">
          ${text(item.icon)}
        </span>

        <span>
          <strong>
            ${text(item.title)}
          </strong>

          <small>
            ${text(categoryLabel(item.category))}
          </small>
        </span>
      </button>
    `
  ).join("");

  $$("[data-map-place]", target).forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          focusDestination(
            button.dataset.mapPlace,
            false
          );
        }
      );
    }
  );
}


/* =========================================================
   PESAN KESALAHAN PETA
========================================================= */

function showMapError(message) {
  const errorElement =
    $("#mapError");

  if (!errorElement) {
    return;
  }

  if (message) {
    errorElement.textContent = message;
  }

  errorElement.hidden = false;
}


/* =========================================================
   MEMPERBARUI UKURAN PETA
========================================================= */

function refreshMap(delay = 0) {
  if (!appState.map) {
    return;
  }

  window.clearTimeout(
    appState.resizeTimer
  );

  appState.resizeTimer =
    window.setTimeout(() => {
      appState.map.invalidateSize({
        pan: false,
        animate: false
      });
    }, delay);
}


/* =========================================================
   MEMBUAT PETA SEDERHANA
========================================================= */

function initMap() {
  const mapElement =
    document.getElementById("argosariMap");

  if (!mapElement) {
    console.error(
      "Elemen #argosariMap tidak ditemukan."
    );

    return;
  }

  if (typeof window.L === "undefined") {
    showMapError(
      "Leaflet tidak dapat dimuat. Periksa koneksi internet lalu muat ulang halaman."
    );

    return;
  }

  if (appState.map) {
    return;
  }

  try {
    /*
     * Peta dibuat satu kali saja.
     * Konfigurasinya sengaja sederhana.
     */
    appState.map = L.map(
      "argosariMap",
      {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
        keyboard: true,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true
      }
    ).setView(
      SITE_CONFIG.mapCenter,
      SITE_CONFIG.mapZoom
    );

    /*
     * Peta dasar OpenStreetMap.
     */
    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        minZoom: 3,
        maxZoom: 19,
        tileSize: 256,
        detectRetina: false,
        keepBuffer: 3,
        updateWhenIdle: false,
        attribution:
          SITE_CONFIG.tileAttribution ||
          "© OpenStreetMap"
      }
    ).addTo(appState.map);

    /*
     * Semua marker dimasukkan ke satu layer.
     */
    appState.markerLayer =
      L.featureGroup().addTo(
        appState.map
      );

    DESTINATIONS.forEach((item) => {
      /*
       * Menggunakan marker standar Leaflet.
       * Tidak memakai marker HTML khusus agar lebih ringan.
       */
      const marker = L.marker(
        [item.lat, item.lng],
        {
          title: item.title,
          riseOnHover: true
        }
      );

      marker.bindPopup(
        popupHtml(item),
        {
          maxWidth: 300,
          autoPan: true,
          autoPanPadding: [20, 20]
        }
      );

      marker.addTo(
        appState.markerLayer
      );

      appState.markers.set(
        item.id,
        marker
      );
    });

    /*
     * Menampilkan semua lokasi saat pertama dibuka.
     */
    const bounds =
      appState.markerLayer.getBounds();

    if (bounds.isValid()) {
      appState.map.fitBounds(
        bounds,
        {
          padding: [35, 35],
          maxZoom: 14,
          animate: false
        }
      );
    }

    /*
     * Tunggu layout selesai sebelum menghitung ukuran.
     */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        refreshMap(0);
      });
    });

    window.setTimeout(
      () => refreshMap(0),
      250
    );
  } catch (error) {
    console.error(
      "Peta gagal dibuat:",
      error
    );

    showMapError(
      "Peta gagal dibuat. Periksa Console browser untuk melihat kesalahan."
    );
  }
}


/* =========================================================
   FOKUS KE SATU DESTINASI
========================================================= */

function focusDestination(
  destinationId,
  scrollToMap = true
) {
  const destination =
    DESTINATIONS.find(
      (item) =>
        item.id === destinationId
    );

  const marker =
    appState.markers.get(
      destinationId
    );

  if (
    !destination ||
    !marker ||
    !appState.map
  ) {
    return;
  }

  if (scrollToMap) {
    document
      .getElementById("peta")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
  }

  const delay =
    scrollToMap ? 500 : 0;

  window.setTimeout(() => {
    refreshMap(0);

    appState.map.flyTo(
      [
        destination.lat,
        destination.lng
      ],
      16,
      {
        animate: true,
        duration: 0.7
      }
    );

    window.setTimeout(() => {
      marker.openPopup();
    }, 720);
  }, delay);
}


/* =========================================================
   PENANGANAN PERUBAHAN UKURAN
========================================================= */

function setupMapRefresh() {
  let resizeTimer;

  window.addEventListener(
    "load",
    () => refreshMap(150),
    {
      once: true
    }
  );

  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(
        resizeTimer
      );

      resizeTimer =
        window.setTimeout(() => {
          refreshMap(0);
        }, 200);
    },
    {
      passive: true
    }
  );

  window.addEventListener(
    "orientationchange",
    () => refreshMap(300),
    {
      passive: true
    }
  );

  $$('a[href="#peta"]').forEach(
    (link) => {
      link.addEventListener(
        "click",
        () => refreshMap(500)
      );
    }
  );

  window.addEventListener(
    "hashchange",
    () => {
      if (
        window.location.hash ===
        "#peta"
      ) {
        refreshMap(250);
      }
    }
  );

  if (
    window.location.hash === "#peta"
  ) {
    refreshMap(300);
  }
}


/* =========================================================
   KONTAK WHATSAPP
========================================================= */

function setupContactLinks() {
  const url = whatsappUrl();

  [
    "waUpdate",
    "waFooter",
    "waMobile"
  ].forEach((id) => {
    const element =
      document.getElementById(id);

    if (element) {
      element.href = url;
    }
  });
}


/* =========================================================
   MENJALANKAN WEBSITE
========================================================= */

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


document.addEventListener(
  "DOMContentLoaded",
  boot,
  {
    once: true
  }
);
