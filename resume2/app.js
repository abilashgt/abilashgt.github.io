const DATA_URL = "data/resume.json";

const state = {
  data: null,
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function appendTextBlock(parent, text, tag = "p", className = "") {
  const node = el(tag, className, text);
  parent.appendChild(node);
  return node;
}

function contactLink(item) {
  const link = el("a");
  link.textContent = item.label || item.value;
  link.href = item.href || "#";
  if (item.external) {
    link.target = "_blank";
    link.rel = "noreferrer";
  }
  return link;
}

function renderHero(data) {
  const hero = document.getElementById("hero");
  hero.replaceChildren();

  const identity = el("div", "hero__identity");
  appendTextBlock(identity, data.hero.eyebrow, "p", "eyebrow");
  appendTextBlock(identity, data.hero.name, "h1");
  appendTextBlock(identity, data.hero.summary, "p", "summary");

  const contact = el("aside", "hero__contact");
  contact.setAttribute("aria-label", "Contact information");
  data.hero.contact.forEach((item) => contact.appendChild(contactLink(item)));

  hero.append(identity, contact);
}

function renderStats(data) {
  const stats = document.getElementById("stats");
  stats.replaceChildren();

  data.stats.forEach((item) => {
    const stat = el("div", "stat");
    appendTextBlock(stat, item.value, "span", "stat__value");
    appendTextBlock(stat, item.label, "span", "stat__label");
    stats.appendChild(stat);
  });
}

function renderListSection(title, items, parent, options = {}) {
  const card = el("section", "card");
  appendTextBlock(card, title, "h2");

  if (options.type === "chips") {
    const list = el("ul", "chips");
    items.forEach((item) => {
      list.appendChild(el("li", "", item));
    });
    card.appendChild(list);
  } else if (options.type === "lines") {
    items.forEach((item) => {
      appendTextBlock(card, item, "p", "meta");
    });
  } else if (options.type === "bullets") {
    const list = el("ul", `bullets${options.tight ? " bullets--tight" : ""}`);
    items.forEach((item) => {
      const li = el("li");
      li.textContent = item;
      list.appendChild(li);
    });
    card.appendChild(list);
  } else {
    items.forEach((item) => {
      const entry = el("article", "mini-entry");
      appendTextBlock(entry, item.title, "h3");
      item.lines.forEach((line) => appendTextBlock(entry, line, "p"));
      card.appendChild(entry);
    });
  }

  parent.appendChild(card);
}

function renderSidebar(data) {
  const sidebar = document.getElementById("sidebar");
  sidebar.replaceChildren();

  renderListSection("Skills", data.skills, sidebar, { type: "chips" });
  renderListSection("Education", data.education, sidebar);
  renderListSection("Personal", data.personal, sidebar, { type: "lines" });
  renderListSection("Achievements", data.achievements, sidebar, { type: "bullets", tight: true });
}

function renderExperienceSection(data, parent) {
  const card = el("section", "card card--primary");
  appendTextBlock(card, "Experience", "h2");

  data.experience.forEach((item) => {
    const entry = el("article", "entry");
    const top = el("div", "entry__top");
    const left = el("div");

    appendTextBlock(left, item.company, "h3");
    appendTextBlock(left, item.role, "p", "meta");
    appendTextBlock(top, `${item.dates} · ${item.location}`, "p", "meta meta--right");
    top.insertBefore(left, top.firstChild);

    const bullets = el("ul", "bullets");
    item.bullets.forEach((bullet) => {
      const li = el("li");
      li.textContent = bullet;
      bullets.appendChild(li);
    });

    entry.append(top, bullets);
    card.appendChild(entry);
  });

  parent.appendChild(card);
}

function renderProjectsSection(data, parent) {
  const card = el("section", "card");
  appendTextBlock(card, "Projects", "h2");

  data.projects.forEach((item) => {
    const entry = el("article", "entry entry--compact");
    appendTextBlock(entry, item.title, "h3");
    appendTextBlock(entry, item.description);
    card.appendChild(entry);
  });

  parent.appendChild(card);
}

function renderContent(data) {
  const content = document.getElementById("content");
  content.replaceChildren();

  renderExperienceSection(data, content);
  renderProjectsSection(data, content);
}

function applyMetadata(data) {
  document.title = data.hero.name ? `${data.hero.name} | Resume 2` : "Resume 2";
}

function loadEmbeddedData() {
  const script = document.getElementById("resume-data");
  if (!script) {
    return null;
  }

  const raw = script.textContent.trim();
  if (!raw) {
    return null;
  }

  return JSON.parse(raw);
}

async function main() {
  let data = null;

  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load ${DATA_URL}: ${response.status}`);
    }
    data = await response.json();
  } catch (error) {
    data = loadEmbeddedData();
    if (!data) {
      throw error;
    }
  }

  state.data = data;
  applyMetadata(data);
  renderHero(data);
  renderStats(data);
  renderSidebar(data);
  renderContent(data);
}

main().catch((error) => {
  const body = document.body;
  body.replaceChildren();

  const main = el("main");
  main.style.maxWidth = "720px";
  main.style.margin = "40px auto";
  main.style.padding = "24px";
  main.style.fontFamily = "system-ui, sans-serif";

  appendTextBlock(main, "Resume 2 could not load", "h1");
  appendTextBlock(main, "The JSON data store could not be fetched.");

  const pre = el("pre");
  pre.style.whiteSpace = "pre-wrap";
  pre.style.background = "#f5f5f5";
  pre.style.padding = "16px";
  pre.style.borderRadius = "8px";
  pre.textContent = error.message;
  main.appendChild(pre);

  appendTextBlock(main, "Serve the directory over HTTP, then open resume2/ in the browser.");
  body.appendChild(main);
});
