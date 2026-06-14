let siteData = {};
let allLessons = [];
let faqData = [];
let glossaryData = [];

async function loadAll() {
  siteData = await fetchJson("data/site.json");
  faqData = await fetchJson("data/faq.json");
  glossaryData = await fetchJson("data/glossary.json");

  const seo = await fetchJson("data/seo.json");
  const aeo = await fetchJson("data/aeo.json");
  const geo = await fetchJson("data/geo.json");
  const ai = await fetchJson("data/ai-search.json");

  allLessons = [...seo, ...aeo, ...geo, ...ai];

  applyRoute();
}

function fetchJson(url) {
  return fetch(url).then(res => res.json());
}

function applyRoute() {
  const page = window.location.pathname.split("/").pop();
  const id = new URLSearchParams(window.location.search).get("id");

  if (page === "index.html") {
    renderHome();
  } else if (page === "lessons.html") {
    renderLessons();
  } else if (page === "lesson.html" && id) {
    renderLesson(id);
  } else if (page === "glossary.html") {
    renderGlossary();
  }
}

function renderHome() {
  document.title = siteData.title || "SEO AEO GEO Academy";
  const faqList = document.getElementById("faq-list");
  if (faqList) {
    faqList.innerHTML = faqData
      .slice(0, 4)
      .map(f => `<div><strong>${f.question}</strong><br>${f.answer}</div>`)
      .join("");
  }
}

function renderLessons() {
  document.title = "All Lessons";
  const list = document.getElementById("lessons-list");
  const search = document.getElementById("search-bar");
  const filter = document.getElementById("topic-filter");

  if (!list) return;

  function render() {
    const q = search?.value || "";
    const topic = filter?.value || "all";
    const filtered = simpleSearch(allLessons, q).filter(l =>
      topic === "all" || l.topic === topic
    );

    list.innerHTML = filtered
      .map(l => `
        <div class="lesson-card">
          <h3>${l.title}</h3>
          <p>${l.description}</p>
          <small>${l.topic}</small><br>
          <a href="lesson.html?id=${l.id}">Start</a>
        </div>
      `)
      .join("");
  }

  render();
  search?.addEventListener("input", render);
  filter?.addEventListener("change", render);
}

function renderLesson(id) {
  document.title = "Lesson";
  const lesson = allLessons.find(l => l.id === id || l.slug === id);
  if (!lesson) {
    document.getElementById("lesson-content").innerHTML = "<p>Lesson not found.</p>";
    return;
  }

  document.getElementById("lesson-title").textContent = lesson.title;
  document.getElementById("lesson-content").innerHTML = lesson.content;

  const idx = allLessons.findIndex(l => l.id === id);
  const prev = allLessons[idx - 1];
  const next = allLessons[idx + 1];

  const prevEl = document.getElementById("prev-lesson");
  const nextEl = document.getElementById("next-lesson");

  if (prev) prevEl.href = `lesson.html?id=${prev.id}`;
  else prevEl.style.display = "none";

  if (next) nextEl.href = `lesson.html?id=${next.id}`;
  else nextEl.style.display = "none";
}

function renderGlossary() {
  document.title = "Glossary & FAQ";
  const search = document.getElementById("glossary-search");
  const gList = document.getElementById("glossary-list");
  const fList = document.getElementById("faq-glossary-list");

  if (!gList || !fList) return;

  function render() {
    const q = search?.value || "";
    const gFiltered = simpleSearch(glossaryData, q);
    const fFiltered = simpleSearch(faqData, q);

    gList.innerHTML = gFiltered
      .map(g => `<div><strong>${g.term}</strong><br>${g.definition}</div>`)
      .join("");

    fList.innerHTML = fFiltered
      .map(f => `<div><strong>${f.question}</strong><br>${f.answer}</div>`)
      .join("");
  }

  render();
  search?.addEventListener("input", render);
}

loadAll();