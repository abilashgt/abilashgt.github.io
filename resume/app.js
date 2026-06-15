function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function htmlFromLines(lines) {
  return lines.join("<br>");
}

function renderContact(contact) {
  const box = el("div", "contact-info");
  box.append(
    el("span", "email", "Email: "),
    el("span", "email-val", contact.email),
    el("span", "separator"),
    el("span", "phone", "Phone: "),
    el("span", "phone-val", contact.phone),
    document.createElement("br"),
    el("span", "email", "LinkedIn: "),
    el("span", "email-val", contact.linkedin)
  );
  return box;
}

function renderHeader(data) {
  const header = el("div", "header");
  const fullName = el("div", "full-name");
  fullName.append(
    el("span", "first-name", data.name.first),
    el("span", "last-name", data.name.last)
  );

  const about = el("div", "about");
  about.append(
    el("span", "position", data.name.title),
    el("span", "desc", data.summary)
  );

  header.append(fullName, renderContact(data.contact), about);
  return header;
}

function renderExperience(experience) {
  const section = el("div", "section");
  section.append(el("div", "section__title", "Experience"));

  const list = el("div", "section__list");
  experience.forEach((item) => {
    const row = el("div", "section__list-item");
    const left = el("div", "left");
    left.append(
      el("div", "name", item.company),
      el("div", "addr", item.location),
      el("div", "duration", item.duration)
    );

    const right = el("div", "right");
    right.append(
      el("div", "name", item.role),
      el("div", "desc", item.description)
    );

    row.append(left, right);
    list.appendChild(row);
  });

  section.appendChild(list);
  return section;
}

function renderEducation(education) {
  const section = el("div", "section");
  section.append(el("div", "section__title", "Education"));

  const list = el("div", "section__list");
  education.forEach((item) => {
    const row = el("div", "section__list-item");
    const left = el("div", "left");
    left.append(
      el("div", "name", item.school),
      el("div", "addr", item.location),
      el("div", "duration", item.duration)
    );

    const right = el("div", "right");
    right.append(
      el("div", "name", item.degree),
      el("div", "desc", item.description)
    );

    row.append(left, right);
    list.appendChild(row);
  });

  section.appendChild(list);
  return section;
}

function renderAchievements(text) {
  const section = el("div", "section");
  section.append(el("div", "section__title", "Achievements"));
  const list = el("div", "section__list");
  const row = el("div", "section__list-item");
  row.append(el("div", "text", text));
  list.appendChild(row);
  section.appendChild(list);
  return section;
}

function renderSkills(skills) {
  const section = el("div", "section skills-section");
  section.append(el("div", "section__title", "Skills"));

  const list = el("div", "section__list");
  skills.forEach((item) => {
    const row = el("div", "section__list-item");
    const text = el("div", "text");
    text.innerHTML = `<b>${item.label}</b>: ${item.value}`;
    row.appendChild(text);
    list.appendChild(row);
  });

  section.appendChild(list);
  return section;
}

function renderPersonal(text) {
  const section = el("div", "section");
  section.append(el("div", "section__title", "Personal"));
  const list = el("div", "section__list");
  const row = el("div", "section__list-item");
  row.append(el("div", "text", text));
  list.appendChild(row);
  section.appendChild(list);
  return section;
}

function renderProjects(projects) {
  const section = el("div", "section");
  section.append(el("div", "section__title", "Projects"));

  const list = el("div", "section__list");
  projects.forEach((item) => {
    const row = el("div", "section__list-item");
    const text = el("div", "text");
    text.innerHTML = htmlFromLines(item.details);
    row.append(
      el("div", "name", item.name),
      text
    );
    list.appendChild(row);
  });

  section.appendChild(list);
  return section;
}

async function loadData() {
  const response = await fetch("data/resume.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load data/resume.json: ${response.status}`);
  }
  return response.json();
}

async function main() {
  const data = await loadData();
  document.title = `${data.name.first} ${data.name.last} - Resume`;

  const root = document.getElementById("resume-root");
  root.replaceChildren();
  root.append(
    renderHeader(data),
    el("div", "details")
  );

  const details = root.querySelector(".details");
  details.append(
    renderExperience(data.experience),
    renderEducation(data.education),
    renderAchievements(data.achievements),
    renderSkills(data.skills),
    renderPersonal(data.personal),
    renderProjects(data.projects)
  );

  if (new URLSearchParams(window.location.search).get("print") === "1") {
    setTimeout(() => window.print(), 0);
  }
}

main().catch((error) => {
  const root = document.getElementById("resume-root");
  root.replaceChildren();

  const section = el("div", "section");
  section.append(el("div", "section__title", "Error"));
  const list = el("div", "section__list");
  const item = el("div", "section__list-item");
  item.append(el("div", "text", `${error.message}. Open this page via a local HTTP server so it can load data/resume.json.`));
  list.appendChild(item);
  section.appendChild(list);
  root.appendChild(section);
});
