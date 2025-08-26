function switchLang(lang) {
  document.querySelectorAll("[data-en]").forEach(el => {
    el.textContent = el.getAttribute("data-" + lang);
  });
}

// Standard beim Laden
window.addEventListener("load", () => {
  const saved = localStorage.getItem("lang") || "en";
  document.getElementById("lang").value = saved;
  switchLang(saved);
});

// Sprache merken
document.getElementById("lang").addEventListener("change", e => {
  localStorage.setItem("lang", e.target.value);
});
