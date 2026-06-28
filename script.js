const $ = (selector) => document.querySelector(selector);

function setText(selector, value) {
  const element = $(selector);
  if (element && value) element.textContent = value;
}

function safeLink(link) {
  return link && link.trim() !== "" ? link : "#";
}

function renderSiteConfig() {
  setText("#navTitle", CONFIG.site.navTitle);
  setText("#siteTitle", CONFIG.site.title);
  setText("#eyebrow", CONFIG.site.eyebrow);
  setText("#siteSubtitle", CONFIG.site.subtitle);
  setText("#siteIntro", CONFIG.site.intro);
  setText("#noticeText", CONFIG.site.notice);
  setText("#footerText", CONFIG.site.footer);
  setText("#lastUpdated", CONFIG.site.lastUpdated);
  setText("#navLogoText", CONFIG.logos.navText);

  const kknBadge = $("#kknBadge .partner-logo");
  const campusBadge = $("#campusBadge .partner-logo");
  if (kknBadge) kknBadge.textContent = CONFIG.logos.kknText || "KKN";
  if (campusBadge) campusBadge.textContent = CONFIG.logos.campusText || "🏛️";

  setText("#formTitle", CONFIG.form.title);
  setText("#formDescription", CONFIG.form.description);

  const formButton = $("#formButton");
  if (formButton) {
    if (CONFIG.form.url && CONFIG.form.url.trim() !== "") {
      formButton.href = CONFIG.form.url;
      formButton.textContent = CONFIG.form.activeText || "Buka Form";
      formButton.removeAttribute("aria-disabled");
      formButton.target = "_blank";
      formButton.rel = "noopener";
    } else {
      formButton.href = "#update";
      formButton.textContent = CONFIG.form.inactiveText || "Form belum aktif";
      formButton.setAttribute("aria-disabled", "true");
    }
  }
}

function createMenuCard(item) {
  const a = document.createElement("a");
  a.className = "menu-card";
  a.href = safeLink(item.link);
  a.dataset.search = `${item.title} ${item.shortTitle || ""} ${item.description || ""}`.toLowerCase();

  a.innerHTML = `
    <span class="icon" aria-hidden="true">${item.icon || "📌"}</span>
    <span>
      <h3>${item.title}</h3>
      <p>${item.description || ""}</p>
      <span class="status">${item.status || "Disiapkan"}</span>
    </span>
    <span class="arrow" aria-hidden="true">›</span>
  `;
  return a;
}

function renderMenu(items = MENU_ITEMS) {
  const grid = $("#menuGrid");
  if (!grid) return;
  grid.innerHTML = "";
  items.forEach((item) => grid.appendChild(createMenuCard(item)));
}

function renderPriorityList(items = MENU_ITEMS) {
  const list = $("#priorityList");
  if (!list) return;
  list.innerHTML = "";
  items.filter((item) => item.priority).forEach((item) => {
    const row = document.createElement("div");
    row.className = "priority-item";
    row.innerHTML = `
      <span class="priority-icon" aria-hidden="true">${item.icon || "📌"}</span>
      <div>
        <h3>${item.shortTitle || item.title}</h3>
        <p>${item.description || ""}</p>
      </div>
    `;
    list.appendChild(row);
  });
}

function setupSearch() {
  const input = $("#searchInput");
  const empty = $("#emptyState");
  if (!input) return;

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    const cards = Array.from(document.querySelectorAll(".menu-card"));
    let visibleCount = 0;

    cards.forEach((card) => {
      const matches = card.dataset.search.includes(query);
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    if (empty) empty.hidden = visibleCount !== 0;
  });
}

renderSiteConfig();
renderMenu();
renderPriorityList();
setupSearch();
