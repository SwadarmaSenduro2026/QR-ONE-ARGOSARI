/* =========================================================
   QR-ONE ARGOSARI — SCRIPT HALAMAN UTAMA
   Versi perbaikan galeri, navigasi, dan peta Leaflet
========================================================= */

"use strict";


/* =========================================================
   1. UTILITAS SELECTOR
========================================================= */

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));


/* =========================================================
   2. STATE APLIKASI
========================================================= */

const state = {
  sliderIndex: 0,

  map: null,
  tileLayer: null,
  markerGroup: null,

  markers: new Map(),

  mapInitStarted: false,
  mapReady: false,

  resizeTimer: null,
  resizeObserver: null,
  intersectionObserver: null,

  refreshTimers: new Set(),

  lastMapWidth: 0,
  lastMapHeight: 0
};


/* =========================================================
   3. UTILITAS DATA
========================================================= */

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function categoryLabel(category) {
  return (
    CATEGORIES[category] ||
    category ||
    "Informasi"
  );
}


function itemUrl(item) {
  if (item.kind === "collection") {
    return (
      `detail.html?collection=${encodeURIComponent(item.id)}`
    );
  }

  return (
    `detail.html?id=${encodeURIComponent(item.id)}`
  );
}


function hasValidCoordinates(item) {
  const latitude = Number(item?.lat);
  const longitude = Number(item?.lng);

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}


function getMapDestinations() {
  return DESTINATIONS.filter(hasValidCoordinates);
}


function routeUrl(item) {
  const latitude = Number(item.lat);
  const longitude = Number(item.lng);

  return (
    "https://www.google.com/maps/dir/" +
    `?api=1&destination=${encodeURIComponent(
      `${latitude},${longitude}`
    )}`
  );
}


function whatsappUrl(
  message = SITE_CONFIG.whatsappMessage
) {
  return (
    `https://wa.me/${SITE_CONFIG.whatsappNumber}` +
    `?text=${encodeURIComponent(message)}`
  );
}


/* =========================================================
   4. FALLBACK GAMBAR
========================================================= */

function setupImageFallbacks() {
  document.addEventListener(
    "error",
    (event) => {
      const image = event.target;

      if (!(image instanceof HTMLImageElement)) {
        return;
      }

      if (
        image.dataset.fallbackApplied === "true"
      ) {
        return;
      }

      image.dataset.fallbackApplied = "true";

      if (SITE_CONFIG.fallbackImage) {
        image.src = SITE_CONFIG.fallbackImage;
      }
    },
    true
  );
}


/* =========================================================
   5. NAVIGASI
========================================================= */

function setupNavigation() {
  const toggle = $(".menu-toggle");
  const links = $("#navLinks");

  if (!toggle || !links) {
    return;
  }

  const closeMenu = () => {
    links.classList.remove("open");

    toggle.setAttribute(
      "aria-expanded",
      "false"
    );
  };


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
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    }
  );


  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;

      if (
        !(target instanceof Node) ||
        links.contains(target) ||
        toggle.contains(target)
      ) {
        return;
      }

      closeMenu();
    }
  );
}


/* =========================================================
   6. SLIDER JELAJAHI ARGOSARI
========================================================= */

function renderSlider() {
  const track = $("#sliderTrack");
  const dots = $("#sliderDots");

  if (
    !track ||
    !dots ||
    !Array.isArray(EXPLORE_ITEMS) ||
    EXPLORE_ITEMS.length === 0
  ) {
    return;
  }

  state.sliderIndex =
    (
      state.sliderIndex +
      EXPLORE_ITEMS.length
    ) % EXPLORE_ITEMS.length;

  const item =
    EXPLORE_ITEMS[state.sliderIndex];

  const actionText =
    item.kind === "collection"
      ? "Buka daftar tempat"
      : "Lihat informasi lengkap";


  track.innerHTML = `
    <a
      class="explore-card"
      href="${escapeHtml(itemUrl(item))}"
      aria-label="${escapeHtml(actionText)}: ${escapeHtml(item.title)}"
    >
      <div class="explore-image">
        <img
          src="${escapeHtml(item.image)}"
          alt="${escapeHtml(item.title)}"
          loading="lazy"
          decoding="async"
          width="900"
          height="560"
        />

        <span class="explore-badge">
          ${escapeHtml(item.status)}
        </span>
      </div>

      <div class="explore-content">
        <span class="explore-category">
          ${escapeHtml(item.icon)}
          ${escapeHtml(
            categoryLabel(item.category)
          )}
        </span>

        <h3>
          ${escapeHtml(item.title)}
        </h3>

        <p>
          ${escapeHtml(item.summary)}
        </p>

        <span class="explore-action">
          ${escapeHtml(actionText)}
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  `;


  dots.innerHTML = EXPLORE_ITEMS
    .map(
      (entry, index) => `
        <button
          class="slider-dot${
            index === state.sliderIndex
              ? " active"
              : ""
          }"
          type="button"
          data-slide-index="${index}"
          aria-label="Tampilkan ${escapeHtml(
            entry.title
          )}"
          aria-current="${
            index === state.sliderIndex
              ? "true"
              : "false"
          }"
        ></button>
      `
    )
    .join("");


  $$("[data-slide-index]", dots)
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          state.sliderIndex =
            Number(
              button.dataset.slideIndex
            );

          renderSlider();
        }
      );
    });
}


function setupSlider() {
  const slider = $(".explore-slider");
  const prev = $(".slider-btn.prev");
  const next = $(".slider-btn.next");

  if (
    !slider ||
    !prev ||
    !next ||
    !Array.isArray(EXPLORE_ITEMS) ||
    EXPLORE_ITEMS.length === 0
  ) {
    return;
  }


  slider.setAttribute("tabindex", "0");


  const move = (direction) => {
    state.sliderIndex =
      (
        state.sliderIndex +
        direction +
        EXPLORE_ITEMS.length
      ) % EXPLORE_ITEMS.length;

    renderSlider();
  };


  prev.addEventListener(
    "click",
    () => move(-1)
  );


  next.addEventListener(
    "click",
    () => move(1)
  );


  slider.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
    }
  );


  renderSlider();
}


/* =========================================================
   7. INFORMASI PERJALANAN
========================================================= */

function renderImportantLinks() {
  const target = $("#importantLinks");

  if (
    !target ||
    !Array.isArray(IMPORTANT_LINKS)
  ) {
    return;
  }


  target.innerHTML = IMPORTANT_LINKS
    .map(
      (link) => `
        <a
          class="info-link"
          href="${escapeHtml(link.url)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Buka ${escapeHtml(
            link.title
          )}"
        >
          <div class="info-illustration">
            <img
              src="${escapeHtml(link.image)}"
              alt="${escapeHtml(
                link.imageAlt ||
                link.title
              )}"
              width="80"
              height="80"
              loading="lazy"
              decoding="async"
            />
          </div>

          <strong>
            ${escapeHtml(link.title)}
          </strong>

          <p>
            ${escapeHtml(
              link.description
            )}
          </p>

          <span class="info-link-action">
            Buka informasi
            <span aria-hidden="true">
              →
            </span>
          </span>
        </a>
      `
    )
    .join("");
}


/* =========================================================
   8. POPUP PETA
========================================================= */

function popupHtml(item) {
  return `
    <div class="map-popup">
      <strong>
        ${escapeHtml(item.title)}
      </strong>

      <p>
        ${escapeHtml(item.summary)}
      </p>

      <div class="map-popup-actions">
        <a
          href="${escapeHtml(itemUrl(item))}"
        >
          Detail
        </a>

        <a
          href="${escapeHtml(routeUrl(item))}"
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
   9. DAFTAR LOKASI PETA
========================================================= */

function renderMapPlaceList() {
  const list = $("#mapPlaceList");

  if (!list) {
    return;
  }

  const destinations =
    getMapDestinations();


  if (destinations.length === 0) {
    list.innerHTML = `
      <p class="empty-state">
        Belum ada lokasi dengan koordinat
        yang dapat ditampilkan.
      </p>
    `;

    return;
  }


  list.innerHTML = destinations
    .map(
      (item) => `
        <button
          class="map-place-button"
          type="button"
          data-map-place="${escapeHtml(
            item.id
          )}"
        >
          <span
            class="map-place-icon"
            aria-hidden="true"
          >
            ${escapeHtml(item.icon)}
          </span>

          <span>
            <strong>
              ${escapeHtml(item.title)}
            </strong>

            <small>
              ${escapeHtml(
                categoryLabel(
                  item.category
                )
              )}
            </small>
          </span>
        </button>
      `
    )
    .join("");


  $$("[data-map-place]", list)
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          focusDestination(
            button.dataset.mapPlace,
            false
          );
        }
      );
    });
}


/* =========================================================
   10. PESAN ERROR PETA
========================================================= */

function showMapError(message) {
  const box = $("#mapError");

  if (!box) {
    return;
  }

  if (message) {
    box.textContent = message;
  }

  box.hidden = false;
}


function hideMapError() {
  const box = $("#mapError");

  if (box) {
    box.hidden = true;
  }
}


/* =========================================================
   11. PENGATURAN UKURAN PETA
========================================================= */

function mapContainerIsReady() {
  const mapElement = $("#argosariMap");

  if (!mapElement) {
    return false;
  }

  const rectangle =
    mapElement.getBoundingClientRect();

  return (
    rectangle.width >= 200 &&
    rectangle.height >= 200
  );
}


function clearScheduledMapRefreshes() {
  state.refreshTimers.forEach(
    (timer) => {
      window.clearTimeout(timer);
    }
  );

  state.refreshTimers.clear();
}


function performMapRefresh({
  redrawTiles = true
} = {}) {
  if (!state.map) {
    return;
  }

  try {
    state.map.invalidateSize({
      pan: false,
      animate: false
    });

    if (
      redrawTiles &&
      state.tileLayer
    ) {
      state.tileLayer.redraw();
    }
  } catch (error) {
    console.warn(
      "Pembaruan ukuran peta gagal:",
      error
    );
  }
}


function scheduleMapRefresh(
  delays = [0],
  options = {}
) {
  if (!state.map) {
    return;
  }

  delays.forEach((delay) => {
    const timer =
      window.setTimeout(() => {
        state.refreshTimers.delete(timer);

        performMapRefresh(options);
      }, delay);

    state.refreshTimers.add(timer);
  });
}


function fitMapToMarkers() {
  if (
    !state.map ||
    !state.markerGroup
  ) {
    return;
  }

  const bounds =
    state.markerGroup.getBounds();

  if (!bounds.isValid()) {
    state.map.setView(
      SITE_CONFIG.mapCenter,
      SITE_CONFIG.mapZoom,
      {
        animate: false
      }
    );

    return;
  }

  state.map.fitBounds(
    bounds,
    {
      paddingTopLeft: [42, 42],
      paddingBottomRight: [42, 42],
      maxZoom: 14,
      animate: false
    }
  );
}


/* =========================================================
   12. RESIZE OBSERVER PETA
========================================================= */

function observeMapSize(mapElement) {
  if (
    !mapElement ||
    typeof ResizeObserver === "undefined"
  ) {
    return;
  }

  state.resizeObserver?.disconnect();


  state.resizeObserver =
    new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry || !state.map) {
        return;
      }

      const width =
        Math.round(
          entry.contentRect.width
        );

      const height =
        Math.round(
          entry.contentRect.height
        );


      const widthChanged =
        Math.abs(
          width -
          state.lastMapWidth
        ) > 1;

      const heightChanged =
        Math.abs(
          height -
          state.lastMapHeight
        ) > 1;


      if (
        !widthChanged &&
        !heightChanged
      ) {
        return;
      }


      state.lastMapWidth = width;
      state.lastMapHeight = height;


      scheduleMapRefresh(
        [0, 100, 300],
        {
          redrawTiles: true
        }
      );
    });


  state.resizeObserver.observe(
    mapElement
  );
}


/* =========================================================
   13. INISIALISASI LEAFLET
========================================================= */

function initMap() {
  const mapElement =
    $("#argosariMap");

  if (
    !mapElement ||
    state.map ||
    state.mapInitStarted
  ) {
    return;
  }


  if (
    typeof window.L === "undefined"
  ) {
    showMapError(
      "Leaflet tidak dapat dimuat. " +
      "Periksa koneksi internet lalu " +
      "muat ulang halaman."
    );

    return;
  }


  if (!mapContainerIsReady()) {
    return;
  }


  state.mapInitStarted = true;


  try {
    state.map = L.map(
      mapElement,
      {
        center:
          SITE_CONFIG.mapCenter,

        zoom:
          SITE_CONFIG.mapZoom,

        zoomControl: true,

        scrollWheelZoom: false,

        doubleClickZoom: true,

        dragging: true,

        keyboard: true,

        boxZoom: true,

        tap: true,

        zoomAnimation: false,

        fadeAnimation: false,

        markerZoomAnimation: false,

        inertia: true,

        trackResize: true
      }
    );


    state.tileLayer = L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        minZoom: 3,
        maxZoom: 19,

        tileSize: 256,

        keepBuffer: 4,

        updateWhenIdle: false,

        updateWhenZooming: false,

        detectRetina: false,

        crossOrigin: true,

        attribution:
          SITE_CONFIG.tileAttribution
      }
    ).addTo(state.map);


    state.markerGroup =
      L.featureGroup().addTo(
        state.map
      );


    getMapDestinations()
      .forEach((item) => {
        const latitude =
          Number(item.lat);

        const longitude =
          Number(item.lng);


        const marker = L.marker(
          [latitude, longitude],
          {
            title: item.title,
            riseOnHover: true
          }
        )
          .bindPopup(
            popupHtml(item),
            {
              maxWidth: 300,

              autoPan: true,

              autoPanPadding:
                [24, 24]
            }
          )
          .addTo(
            state.markerGroup
          );


        state.markers.set(
          item.id,
          marker
        );
      });


    observeMapSize(mapElement);

    hideMapError();


    state.map.whenReady(() => {
      state.mapReady = true;


      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          performMapRefresh({
            redrawTiles: true
          });

          fitMapToMarkers();
        });
      });


      scheduleMapRefresh(
        [120, 350, 800, 1500],
        {
          redrawTiles: true
        }
      );


      window.setTimeout(() => {
        fitMapToMarkers();

        performMapRefresh({
          redrawTiles: true
        });
      }, 250);
    });


    state.tileLayer.on(
      "tileerror",
      (event) => {
        console.warn(
          "Tile peta gagal dimuat:",
          event
        );
      }
    );
  } catch (error) {
    console.error(
      "Peta gagal dibuat:",
      error
    );

    state.mapInitStarted = false;
    state.mapReady = false;
    state.map = null;
    state.tileLayer = null;
    state.markerGroup = null;

    showMapError(
      "Peta gagal dibuat. " +
      "Muat ulang halaman atau " +
      "periksa Console browser."
    );
  }
}


/* =========================================================
   14. MENUNGGU UKURAN KONTAINER PETA
========================================================= */

function ensureMapInitialized(
  attempt = 0
) {
  if (state.map) {
    return;
  }

  if (mapContainerIsReady()) {
    initMap();

    return;
  }

  if (attempt >= 30) {
    showMapError(
      "Ukuran area peta tidak terbaca. " +
      "Periksa pengaturan tinggi peta " +
      "pada style.css."
    );

    return;
  }

  window.setTimeout(
    () => {
      ensureMapInitialized(
        attempt + 1
      );
    },
    100
  );
}


/* =========================================================
   15. INTERSECTION OBSERVER
========================================================= */

function setupMapInitialization() {
  const mapSection = $("#peta");

  if (!mapSection) {
    return;
  }


  if (
    "IntersectionObserver" in window
  ) {
    state.intersectionObserver =
      new IntersectionObserver(
        (entries) => {
          const entry = entries[0];

          if (!entry) {
            return;
          }

          if (entry.isIntersecting) {
            ensureMapInitialized();

            scheduleMapRefresh(
              [0, 150, 500],
              {
                redrawTiles: true
              }
            );
          }
        },
        {
          root: null,

          rootMargin:
            "500px 0px 500px 0px",

          threshold: 0.01
        }
      );


    state.intersectionObserver.observe(
      mapSection
    );
  }


  window.addEventListener(
    "load",
    () => {
      window.setTimeout(
        ensureMapInitialized,
        150
      );
    },
    {
      once: true
    }
  );


  window.setTimeout(
    ensureMapInitialized,
    400
  );
}


/* =========================================================
   16. FOKUS DESTINASI
========================================================= */

function focusDestination(
  id,
  scrollToMap = true
) {
  const item =
    getMapDestinations()
      .find(
        (destination) =>
          destination.id === id
      );


  if (!item) {
    return;
  }


  if (scrollToMap) {
    $("#peta")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  ensureMapInitialized();


  let attempts = 0;


  const openDestination = () => {
    const marker =
      state.markers.get(id);


    if (
      !state.map ||
      !marker
    ) {
      attempts += 1;

      if (attempts <= 25) {
        window.setTimeout(
          openDestination,
          100
        );
      }

      return;
    }


    const latitude =
      Number(item.lat);

    const longitude =
      Number(item.lng);


    performMapRefresh({
      redrawTiles: true
    });


    state.map.setView(
      [latitude, longitude],
      16,
      {
        animate: false
      }
    );


    window.setTimeout(() => {
      marker.openPopup();

      performMapRefresh({
        redrawTiles: false
      });
    }, 180);
  };


  window.setTimeout(
    openDestination,
    scrollToMap ? 500 : 50
  );
}


/* =========================================================
   17. REFRESH PETA
========================================================= */

function setupMapRefresh() {
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(
        state.resizeTimer
      );

      state.resizeTimer =
        window.setTimeout(() => {
          ensureMapInitialized();

          scheduleMapRefresh(
            [0, 150, 400],
            {
              redrawTiles: true
            }
          );
        }, 180);
    },
    {
      passive: true
    }
  );


  window.addEventListener(
    "orientationchange",
    () => {
      scheduleMapRefresh(
        [250, 600],
        {
          redrawTiles: true
        }
      );
    },
    {
      passive: true
    }
  );


  window.addEventListener(
    "pageshow",
    () => {
      ensureMapInitialized();

      scheduleMapRefresh(
        [0, 200, 600],
        {
          redrawTiles: true
        }
      );
    }
  );


  document.addEventListener(
    "visibilitychange",
    () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        scheduleMapRefresh(
          [0, 200],
          {
            redrawTiles: true
          }
        );
      }
    }
  );


  window.addEventListener(
    "hashchange",
    () => {
      if (
        window.location.hash === "#peta"
      ) {
        ensureMapInitialized();

        scheduleMapRefresh(
          [100, 400, 800],
          {
            redrawTiles: true
          }
        );
      }
    }
  );


  $$(
    '#navLinks a[href="#peta"], ' +
    '.hero-actions a[href="#peta"], ' +
    '.mobile-nav a[href="#peta"]'
  ).forEach((link) => {
    link.addEventListener(
      "click",
      () => {
        ensureMapInitialized();

        scheduleMapRefresh(
          [300, 650, 1000],
          {
            redrawTiles: true
          }
        );
      }
    );
  });


  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      ensureMapInitialized();

      scheduleMapRefresh(
        [0, 150],
        {
          redrawTiles: true
        }
      );
    });
  }
}


/* =========================================================
   18. KONTAK WHATSAPP
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
   19. BOOT
========================================================= */

function boot() {
  setupImageFallbacks();

  setupNavigation();

  setupSlider();

  renderImportantLinks();

  renderMapPlaceList();

  setupContactLinks();

  setupMapInitialization();

  setupMapRefresh();
}


document.addEventListener(
  "DOMContentLoaded",
  boot,
  {
    once: true
  }
);


/* =========================================================
   20. BERSIHKAN OBSERVER SAAT HALAMAN DITINGGALKAN
========================================================= */

window.addEventListener(
  "pagehide",
  () => {
    clearScheduledMapRefreshes();

    state.resizeObserver?.disconnect();

    state.intersectionObserver?.disconnect();
  }
);
