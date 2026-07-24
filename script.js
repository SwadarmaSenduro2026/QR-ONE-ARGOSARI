/* =========================================================
   SCRIPT HALAMAN UTAMA QR-ONE ARGOSARI

   Perbaikan utama:
   1. Peta memenuhi seluruh wadah.
   2. Ukuran Leaflet dihitung setelah layout selesai.
   3. Pencarian tidak melakukan zoom setiap mengetik.
   4. Resize tidak menjalankan invalidateSize berulang-ulang.
   5. Pergerakan peta dan perpindahan marker lebih halus.
========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];

const FALLBACK_IMAGE = "assets/hero-argosari.svg";

const appState = {
  activeCategory: "semua",
  search: "",
  map: null,
  tileLayer: null,
  markers: new Map(),
  userMarker: null,
  sliderIndex: 0,
  mapResizeTimer: null,
  searchTimer: null,
  initialMapFitDone: false
};


/* =========================================================
   UTILITAS
========================================================= */

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function categoryLabel(categoryId) {
  return (
    CATEGORIES.find(
      (category) => category.id === categoryId
    )?.label || categoryId
  );
}


function detailUrl(destination) {
  return `detail.html?id=${encodeURIComponent(
    destination.id
  )}`;
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


function filteredDestinations() {
  const keyword =
    appState.search.trim().toLowerCase();

  return DESTINATIONS.filter((item) => {
    const matchesCategory =
      appState.activeCategory === "semua" ||
      item.category === appState.activeCategory;

    const searchableText = [
      item.title,
      item.summary,
      item.description,
      item.status,
      item.address,
      categoryLabel(item.category),
      ...(item.facilities || [])
    ]
      .join(" ")
      .toLowerCase();

    const matchesKeyword =
      !keyword ||
      searchableText.includes(keyword);

    return (
      matchesCategory &&
      matchesKeyword
    );
  });
}


/* =========================================================
   GAMBAR CADANGAN
========================================================= */

function setupImageFallbacks() {
  document.addEventListener(
    "error",
    (event) => {
      const image = event.target;

      if (
        !(image instanceof HTMLImageElement)
      ) {
        return;
      }

      if (
        image.dataset.fallbackApplied ===
        "true"
      ) {
        return;
      }

      image.dataset.fallbackApplied =
        "true";

      image.src = FALLBACK_IMAGE;
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

  toggle.addEventListener(
    "click",
    () => {
      const open =
        links.classList.toggle("open");

      toggle.setAttribute(
        "aria-expanded",
        String(open)
      );
    }
  );

  $$("a", links).forEach((link) => {
    link.addEventListener(
      "click",
      closeMenu
    );
  });

  document.addEventListener(
    "click",
    (event) => {
      if (
        !links.classList.contains("open")
      ) {
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
   SLIDER
========================================================= */

function renderSlider() {
  const track = $("#sliderTrack");

  if (!track) {
    return;
  }

  track.innerHTML = DESTINATIONS
    .slice(0, 5)
    .map(
      (item, index) => `
        <article
          class="slide-card ${
            index === appState.sliderIndex
              ? "active"
              : ""
          }"
          data-slide="${index}"
        >
          <img
            src="${escapeHtml(item.image)}"
            alt="${escapeHtml(item.title)}"
            loading="lazy"
          />

          <span>
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
        </article>
      `
    )
    .join("");
}


function setupSlider() {
  const previousButton =
    $(".slider-btn.prev");

  const nextButton =
    $(".slider-btn.next");

  const itemCount =
    Math.min(
      DESTINATIONS.length,
      5
    );

  if (
    !previousButton ||
    !nextButton ||
    itemCount === 0
  ) {
    return;
  }

  function move(direction) {
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
    () => move(-1)
  );

  nextButton.addEventListener(
    "click",
    () => move(1)
  );

  renderSlider();
}


/* =========================================================
   LEGENDA
========================================================= */

function renderLegend() {
  const target = $("#legendList");

  if (!target) {
    return;
  }

  target.innerHTML = CATEGORIES.map(
    (category) => `
      <button
        class="legend-item ${
          category.id ===
          appState.activeCategory
            ? "active"
            : ""
        }"
        type="button"
        data-category="${escapeHtml(
          category.id
        )}"
        aria-pressed="${
          category.id ===
          appState.activeCategory
        }"
      >
        <span>
          ${escapeHtml(category.icon)}
        </span>

        <strong>
          ${escapeHtml(category.label)}
        </strong>
      </button>
    `
  ).join("");

  $$(".legend-item", target).forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          appState.activeCategory =
            button.dataset.category ||
            "semua";

          renderLegend();

          renderDestinationCards();

          /*
           * Kamera peta menyesuaikan hanya
           * setelah kategori dipilih.
           */
          updateMarkers({
            fit: true,
            animate: true
          });
        }
      );
    }
  );
}


/* =========================================================
   KARTU DESTINASI
========================================================= */

function renderDestinationCards() {
  const target =
    $("#destinationGrid");

  if (!target) {
    return;
  }

  const items =
    filteredDestinations();

  if (!items.length) {
    target.innerHTML = `
      <div class="empty-state">
        <strong>
          Tempat belum ditemukan.
        </strong>

        <p>
          Coba gunakan kata kunci atau
          kategori yang berbeda.
        </p>
      </div>
    `;

    return;
  }

  target.innerHTML = items
    .map(
      (item) => `
        <article class="tour-card">
          <div class="tour-image">
            <img
              src="${escapeHtml(item.image)}"
              alt="${escapeHtml(item.title)}"
              loading="lazy"
            />

            <span class="tour-badge">
              ${escapeHtml(item.status)}
            </span>
          </div>

          <div class="tour-body">
            <p class="tour-category">
              ${escapeHtml(item.icon)}
              ${escapeHtml(
                categoryLabel(item.category)
              )}
            </p>

            <h3>
              ${escapeHtml(item.title)}
            </h3>

            <p>
              ${escapeHtml(item.summary)}
            </p>

            <div class="card-actions">
              <button
                class="btn btn-soft small"
                type="button"
                data-focus="${escapeHtml(
                  item.id
                )}"
              >
                Lihat di Peta
              </button>

              <a
                class="btn btn-primary small"
                href="${detailUrl(item)}"
              >
                Informasi lebih lanjut
              </a>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  $$(
    "[data-focus]",
    target
  ).forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        focusDestination(
          button.dataset.focus
        );
      }
    );
  });
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

  target.innerHTML =
    IMPORTANT_LINKS.map(
      (link) => `
        <a
          class="info-link"
          href="${escapeHtml(link.url)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="info-icon">
            ${escapeHtml(link.icon)}
          </span>

          <strong>
            ${escapeHtml(link.title)}
          </strong>

          <p>
            ${escapeHtml(
              link.description
            )}
          </p>

          <em>
            Buka informasi →
          </em>
        </a>
      `
    ).join("");
}


/* =========================================================
   MARKER DAN POPUP
========================================================= */

function markerHtml(item) {
  return `
    <div
      class="custom-marker marker-${escapeHtml(
        item.category
      )}"
    >
      <span>
        ${escapeHtml(item.icon)}
      </span>
    </div>
  `;
}


function popupHtml(item) {
  return `
    <div class="popup-card">
      <strong>
        ${escapeHtml(item.title)}
      </strong>

      <p>
        ${escapeHtml(item.summary)}
      </p>

      <div class="popup-actions">
        <a href="${detailUrl(item)}">
          Detail
        </a>

        <a
          href="${routeUrl(item)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Rute
        </a>
      </div>
    </div>
  `;
}


/* =========================================================
   PESAN PETA GAGAL
========================================================= */

function showMapFallback(message) {
  const fallback =
    $("#mapFallback");

  if (!fallback) {
    return;
  }

  if (message) {
    fallback.textContent = message;
  }

  fallback.hidden = false;
}


/* =========================================================
   PERHITUNGAN UKURAN PETA
========================================================= */

function refreshMapSize(delay = 0) {
  if (!appState.map) {
    return;
  }

  window.clearTimeout(
    appState.mapResizeTimer
  );

  appState.mapResizeTimer =
    window.setTimeout(() => {
      /*
       * Hentikan animasi sebelumnya agar
       * tidak bertumpuk.
       */
      appState.map.stop();

      appState.map.invalidateSize({
        pan: false,
        animate: false,
        debounceMoveend: true
      });
    }, delay);
}


/* =========================================================
   PEMBUATAN PETA
========================================================= */

function initMap() {
  const mapElement =
    $("#map");

  if (!mapElement) {
    console.error(
      "Elemen #map tidak ditemukan."
    );

    return;
  }

  if (
    typeof window.L === "undefined"
  ) {
    showMapFallback(
      "Peta tidak dapat dimuat karena Leaflet gagal dibuka. Periksa koneksi internet lalu muat ulang halaman."
    );

    return;
  }

  /*
   * Mencegah peta dibuat dua kali.
   */
  if (appState.map) {
    return;
  }

  try {
    appState.map = L.map(
      mapElement,
      {
        center:
          SITE_CONFIG.mapCenter,

        zoom:
          SITE_CONFIG.mapZoom,

        zoomControl: true,

        attributionControl: true,

        scrollWheelZoom: true,

        doubleClickZoom: true,

        boxZoom: true,

        keyboard: true,

        dragging: true,

        /*
         * Animasi bawaan Leaflet.
         */
        zoomAnimation: true,

        fadeAnimation: true,

        markerZoomAnimation: true,

        /*
         * Momentum saat peta digeser.
         */
        inertia: true,

        inertiaDeceleration: 3000,

        inertiaMaxSpeed: 1500,

        easeLinearity: 0.25,

        /*
         * Roda mouse tidak terlalu sensitif.
         */
        wheelDebounceTime: 40,

        wheelPxPerZoomLevel: 90,

        preferCanvas: false
      }
    );

    appState.tileLayer =
      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          minZoom: 3,

          maxZoom: 19,

          /*
           * Mempertahankan tile di sekitar
           * layar agar drag lebih lancar.
           */
          keepBuffer: 4,

          /*
           * Tile tetap diperbarui saat
           * pengguna menggeser peta.
           */
          updateWhenIdle: false,

          /*
           * Mengurangi pekerjaan saat
           * animasi zoom berlangsung.
           */
          updateWhenZooming: false,

          detectRetina: false,

          attribution:
            SITE_CONFIG.tileAttribution
        }
      );

    appState.tileLayer.addTo(
      appState.map
    );

    appState.tileLayer.on(
      "tileerror",
      (event) => {
        console.warn(
          "Tile peta gagal dimuat:",
          event?.tile?.src || event
        );
      }
    );

    DESTINATIONS.forEach((item) => {
      const marker = L.marker(
        [item.lat, item.lng],
        {
          title: item.title,

          riseOnHover: true,

          icon: L.divIcon({
            html: markerHtml(item),

            className:
              "marker-shell",

            iconSize: [42, 42],

            iconAnchor: [21, 42],

            popupAnchor: [0, -40]
          })
        }
      ).bindPopup(
        popupHtml(item),
        {
          maxWidth: 290,

          autoPan: true,

          autoPanPadding:
            [24, 24]
        }
      );

      marker.addTo(appState.map);

      appState.markers.set(
        item.id,
        marker
      );
    });

    /*
     * Tunggu dua frame sampai CSS Grid dan
     * ukuran .map-wrap selesai dihitung.
     */
    function finishInitialLayout() {
      refreshMapSize(0);

      window.setTimeout(() => {
        if (
          !appState.initialMapFitDone
        ) {
          updateMarkers({
            fit: true,
            animate: false
          });

          appState.initialMapFitDone =
            true;
        }
      }, 60);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(
        finishInitialLayout
      );
    });

    appState.map.whenReady(() => {
      refreshMapSize(120);
    });
  } catch (error) {
    console.error(
      "Peta gagal dibuat:",
      error
    );

    showMapFallback(
      "Peta tidak dapat dibuat. Muat ulang halaman atau periksa Console browser."
    );
  }
}


/* =========================================================
   FILTER MARKER
========================================================= */

function updateMarkers(
  {
    fit = false,
    animate = false
  } = {}
) {
  if (!appState.map) {
    return;
  }

  const visibleItems =
    filteredDestinations();

  const visibleIds =
    new Set(
      visibleItems.map(
        (item) => item.id
      )
    );

  DESTINATIONS.forEach((item) => {
    const marker =
      appState.markers.get(item.id);

    if (!marker) {
      return;
    }

    const shouldBeVisible =
      visibleIds.has(item.id);

    const currentlyVisible =
      appState.map.hasLayer(marker);

    /*
     * Marker hanya ditambah atau dihapus
     * jika statusnya berubah.
     */
    if (
      shouldBeVisible &&
      !currentlyVisible
    ) {
      marker.addTo(appState.map);
    }

    if (
      !shouldBeVisible &&
      currentlyVisible
    ) {
      appState.map.removeLayer(marker);
    }
  });

  /*
   * Jangan mengubah posisi kamera jika
   * fit bernilai false.
   */
  if (
    !fit ||
    visibleItems.length === 0
  ) {
    return;
  }

  refreshMapSize(0);

  appState.map.stop();

  if (visibleItems.length === 1) {
    const item =
      visibleItems[0];

    appState.map.setView(
      [item.lat, item.lng],
      15,
      {
        animate
      }
    );

    return;
  }

  const bounds =
    L.latLngBounds(
      visibleItems.map(
        (item) => [
          item.lat,
          item.lng
        ]
      )
    );

  appState.map.fitBounds(
    bounds,
    {
      paddingTopLeft:
        [44, 44],

      paddingBottomRight:
        [44, 44],

      maxZoom: 14,

      animate
    }
  );
}


/* =========================================================
   FOKUS DESTINASI
========================================================= */

function focusDestination(id) {
  const destination =
    DESTINATIONS.find(
      (item) => item.id === id
    );

  const marker =
    appState.markers.get(id);

  if (
    !destination ||
    !marker ||
    !appState.map
  ) {
    return;
  }

  appState.map.stop();

  appState.activeCategory =
    "semua";

  appState.search = "";

  const input =
    $("#searchInput");

  if (input) {
    input.value = "";
  }

  renderLegend();

  renderDestinationCards();

  updateMarkers({
    fit: false
  });

  document
    .getElementById("peta")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  window.setTimeout(() => {
    refreshMapSize(0);

    appState.map.stop();

    /*
     * flyTo memberi perpindahan
     * yang lebih halus.
     */
    appState.map.flyTo(
      [
        destination.lat,
        destination.lng
      ],
      16,
      {
        animate: true,
        duration: 0.65
      }
    );

    window.setTimeout(() => {
      marker.openPopup();
    }, 700);
  }, 480);
}


/* =========================================================
   PENCARIAN
========================================================= */

function setupSearch() {
  const input =
    $("#searchInput");

  if (!input) {
    return;
  }

  input.addEventListener(
    "input",
    () => {
      window.clearTimeout(
        appState.searchTimer
      );

      /*
       * Debounce mencegah fungsi dijalankan
       * pada setiap penekanan tombol.
       */
      appState.searchTimer =
        window.setTimeout(() => {
          appState.search =
            input.value.trim();

          renderDestinationCards();

          /*
           * Marker diperbarui, tetapi kamera
           * peta tidak langsung berpindah.
           */
          updateMarkers({
            fit: false
          });
        }, 250);
    }
  );

  /*
   * Peta baru menyesuaikan lokasi
   * ketika pengguna menekan Enter.
   */
  input.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key !== "Enter"
      ) {
        return;
      }

      event.preventDefault();

      appState.search =
        input.value.trim();

      renderDestinationCards();

      updateMarkers({
        fit: true,
        animate: true
      });
    }
  );
}


/* =========================================================
   LOKASI PENGGUNA
========================================================= */

function setupLocateButton() {
  const button =
    $("#locateBtn");

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    () => {
      if (
        !navigator.geolocation ||
        !appState.map
      ) {
        window.alert(
          "Fitur lokasi belum tersedia di browser ini."
        );

        return;
      }

      const defaultLabel =
        "📍 Tampilkan lokasi saya";

      button.disabled = true;

      button.textContent =
        "Mencari lokasi...";

      navigator.geolocation
        .getCurrentPosition(
          (position) => {
            const {
              latitude,
              longitude
            } = position.coords;

            if (
              appState.userMarker
            ) {
              appState.map.removeLayer(
                appState.userMarker
              );
            }

            appState.userMarker =
              L.circleMarker(
                [
                  latitude,
                  longitude
                ],
                {
                  radius: 9,

                  weight: 4,

                  color: "#ffffff",

                  fillColor:
                    "#2467d1",

                  fillOpacity: 1
                }
              )
                .addTo(appState.map)
                .bindPopup(
                  "Lokasi Anda saat ini"
                );

            refreshMapSize(0);

            appState.map.flyTo(
              [
                latitude,
                longitude
              ],
              15,
              {
                animate: true,
                duration: 0.65
              }
            );

            appState.userMarker
              .openPopup();

            button.disabled =
              false;

            button.textContent =
              defaultLabel;
          },

          () => {
            window.alert(
              "Lokasi tidak dapat diakses. Izinkan akses lokasi pada browser lalu coba kembali."
            );

            button.disabled =
              false;

            button.textContent =
              defaultLabel;
          },

          {
            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 60000
          }
        );
    }
  );
}


/* =========================================================
   KONTAK
========================================================= */

function setupContactLinks() {
  const url =
    whatsappUrl();

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
   PENANGANAN RESIZE
========================================================= */

function setupMapResizeHandling() {
  let windowResizeTimer = null;

  function handlePageReady() {
    refreshMapSize(120);
  }

  if (
    document.readyState ===
    "complete"
  ) {
    handlePageReady();
  } else {
    window.addEventListener(
      "load",
      handlePageReady,
      {
        once: true
      }
    );
  }

  /*
   * Resize hanya dihitung setelah pengguna
   * selesai mengubah ukuran browser.
   */
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(
        windowResizeTimer
      );

      windowResizeTimer =
        window.setTimeout(() => {
          refreshMapSize(0);
        }, 180);
    },
    {
      passive: true
    }
  );

  window.addEventListener(
    "orientationchange",
    () => {
      refreshMapSize(300);
    },
    {
      passive: true
    }
  );

  /*
   * Hitung ulang ketika tombol menuju
   * bagian peta ditekan.
   */
  $$('a[href="#peta"]').forEach(
    (link) => {
      link.addEventListener(
        "click",
        () => {
          refreshMapSize(420);
        }
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
        refreshMapSize(250);
      }
    }
  );

  /*
   * Hitung ukuran ketika section peta
   * benar-benar masuk ke layar.
   */
  const mapSection =
    document.getElementById("peta");

  if (
    "IntersectionObserver" in window &&
    mapSection
  ) {
    const observer =
      new IntersectionObserver(
        (entries) => {
          const visible =
            entries.some(
              (entry) =>
                entry.isIntersecting
            );

          if (!visible) {
            return;
          }

          refreshMapSize(80);
        },
        {
          root: null,
          threshold: 0.05
        }
      );

    observer.observe(mapSection);
  }

  /*
   * Font Google dapat mengubah ukuran
   * layout setelah selesai dimuat.
   */
  if (document.fonts?.ready) {
    document.fonts.ready.then(
      () => {
        refreshMapSize(80);
      }
    );
  }

  if (
    window.location.hash === "#peta"
  ) {
    refreshMapSize(350);
  }
}


/* =========================================================
   MENJALANKAN WEBSITE
========================================================= */

function boot() {
  setupImageFallbacks();

  setupNavigation();

  setupSlider();

  renderLegend();

  renderDestinationCards();

  renderImportantLinks();

  setupSearch();

  setupLocateButton();

  setupContactLinks();

  initMap();

  setupMapResizeHandling();
}


document.addEventListener(
  "DOMContentLoaded",
  boot,
  {
    once: true
  }
);
