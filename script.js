/* =========================================================
   SCRIPT HALAMAN UTAMA QR-ONE ARGOSARI
========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];

const appState = {
  activeCategory: "semua",
  search: "",
  map: null,
  markers: new Map(),
  userMarker: null,
  sliderIndex: 0,
  mapResizeTimer: null
};

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
      !keyword || searchableText.includes(keyword);

    return matchesCategory && matchesKeyword;
  });
}

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
      image.src = SITE_CONFIG.fallbackImage;
    },
    true
  );
}

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

function renderSlider() {
  const track = $("#sliderTrack");

  if (!track) {
    return;
  }

  const sliderItems =
    DESTINATIONS.slice(0, 5);

  const item =
    sliderItems[appState.sliderIndex];

  if (!item) {
    return;
  }

  track.innerHTML = `
    <article class="slide-card active">
      <img
        src="${escapeHtml(item.image)}"
        alt="${escapeHtml(item.title)}"
        loading="lazy"
      />

      <div class="slide-content">
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

        <a href="${detailUrl(item)}">
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

  const move = (direction) => {
    appState.sliderIndex =
      (
        appState.sliderIndex +
        direction +
        itemCount
      ) % itemCount;

    renderSlider();
  };

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

          updateMarkers({
            fit: true
          });
        }
      );
    }
  );
}

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

  target.innerHTML = items.map(
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
              Informasi Lengkap
            </a>
          </div>
        </div>
      </article>
    `
  ).join("");

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
          ${escapeHtml(link.description)}
        </p>

        <em>
          Buka informasi →
        </em>
      </a>
    `
  ).join("");
}

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

function showMapFallback() {
  const fallback =
    $("#mapFallback");

  if (fallback) {
    fallback.hidden = false;
  }
}

function refreshMapSize(delay = 0) {
  if (!appState.map) {
    return;
  }

  window.clearTimeout(
    appState.mapResizeTimer
  );

  appState.mapResizeTimer =
    window.setTimeout(() => {
      appState.map.invalidateSize({
        pan: false,
        animate: false
      });
    }, delay);
}

function initMap() {
  const mapElement =
    $("#map");

  if (
    !mapElement ||
    typeof window.L === "undefined"
  ) {
    showMapFallback();
    return;
  }

  try {
    appState.map = L.map(
      mapElement,
      {
        scrollWheelZoom: false,
        zoomControl: true,
        preferCanvas: true,
        tap: true
      }
    ).setView(
      SITE_CONFIG.mapCenter,
      SITE_CONFIG.mapZoom
    );

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,

        attribution:
          SITE_CONFIG.tileAttribution
      }
    ).addTo(appState.map);

    DESTINATIONS.forEach((item) => {
      const marker = L.marker(
        [item.lat, item.lng],
        {
          title: item.title,

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
          maxWidth: 290
        }
      );

      marker.addTo(appState.map);

      appState.markers.set(
        item.id,
        marker
      );
    });

    appState.map.whenReady(() => {
      refreshMapSize(80);

      updateMarkers({
        fit: true
      });
    });
  } catch (error) {
    console.error(
      "Peta gagal dimuat:",
      error
    );

    showMapFallback();
  }
}

function updateMarkers(
  {
    fit = true
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

    if (visibleIds.has(item.id)) {
      if (
        !appState.map.hasLayer(marker)
      ) {
        marker.addTo(appState.map);
      }
    } else if (
      appState.map.hasLayer(marker)
    ) {
      appState.map.removeLayer(marker);
    }
  });

  if (
    !fit ||
    visibleItems.length === 0
  ) {
    return;
  }

  refreshMapSize(0);

  if (visibleItems.length === 1) {
    const onlyItem =
      visibleItems[0];

    appState.map.setView(
      [onlyItem.lat, onlyItem.lng],
      15,
      {
        animate: false
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
      padding: [42, 42],
      maxZoom: 14,
      animate: false
    }
  );
}

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

  $("#peta")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  window.setTimeout(() => {
    appState.map.invalidateSize({
      pan: false,
      animate: false
    });

    appState.map.setView(
      [
        destination.lat,
        destination.lng
      ],
      16,
      {
        animate: true
      }
    );

    marker.openPopup();
  }, 550);
}

function setupSearch() {
  const input =
    $("#searchInput");

  if (!input) {
    return;
  }

  let searchTimer;

  input.addEventListener(
    "input",
    () => {
      window.clearTimeout(
        searchTimer
      );

      searchTimer =
        window.setTimeout(() => {
          appState.search =
            input.value;

          renderDestinationCards();

          updateMarkers({
            fit: true
          });
        }, 160);
    }
  );
}

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

      const defaultText =
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
                [latitude, longitude],
                {
                  radius: 9,
                  weight: 4,
                  color: "#ffffff",
                  fillColor: "#2467d1",
                  fillOpacity: 1
                }
              )
                .addTo(appState.map)
                .bindPopup(
                  "Lokasi Anda saat ini"
                );

            refreshMapSize(0);

            appState.map.setView(
              [latitude, longitude],
              15
            );

            appState.userMarker
              .openPopup();

            button.disabled = false;

            button.textContent =
              defaultText;
          },

          () => {
            window.alert(
              "Lokasi tidak dapat diakses. Izinkan akses lokasi pada browser lalu coba kembali."
            );

            button.disabled = false;

            button.textContent =
              defaultText;
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

function setupContactLinks() {
  const mainUrl =
    whatsappUrl();

  [
    "waUpdate",
    "waFooter",
    "waMobile"
  ].forEach((id) => {
    const element =
      document.getElementById(id);

    if (element) {
      element.href = mainUrl;
    }
  });
}

function setupMapResizeHandling() {
  const mapWrap =
    $(".map-wrap");

  window.addEventListener(
    "load",
    () => {
      refreshMapSize(200);
    }
  );

  window.addEventListener(
    "resize",
    () => {
      refreshMapSize(120);
    }
  );

  window.addEventListener(
    "orientationchange",
    () => {
      refreshMapSize(250);
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

  $$('a[href="#peta"]').forEach(
    (link) => {
      link.addEventListener(
        "click",
        () => {
          refreshMapSize(450);
        }
      );
    }
  );

  if (
    "ResizeObserver" in window &&
    mapWrap
  ) {
    const observer =
      new ResizeObserver(() => {
        refreshMapSize(80);
      });

    observer.observe(mapWrap);
  }

  if (document.fonts?.ready) {
    document.fonts.ready.then(
      () => {
        refreshMapSize(60);
      }
    );
  }

  if (
    window.location.hash === "#peta"
  ) {
    refreshMapSize(350);
  }
}

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
  boot
);
