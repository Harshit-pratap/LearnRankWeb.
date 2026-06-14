function slugify(text) {
  return text
    .toLowerCase()
    .replace(/s+/g, "-")
    .replace(/[^w-]/g, "");
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}

function simpleSearch(items, query) {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter(item =>
    (item.title && item.title.toLowerCase().includes(q)) ||
    (item.description && item.description.toLowerCase().includes(q)) ||
    (item.term && item.term.toLowerCase().includes(q)) ||
    (item.question && item.question.toLowerCase().includes(q))
  );
}