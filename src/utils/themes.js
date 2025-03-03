document.addEventListener("DOMContentLoaded", function() {
  const themeDropdown = document.getElementById("themesSelection");
  const body = document.body;

  themeDropdown.value = localStorage.getItem("theme");
 
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
  } else if (localStorage.getItem("theme") === "high-contrast") {
    body.classList.add("high-contrast-mode");
  }

  themeDropdown.addEventListener("change", function() {
    if (themeDropdown.value === "light") {
      body.classList = "";
      localStorage.setItem("theme", "light");
    } else if (themeDropdown.value === "dark") {
      body.classList = "dark-mode";
      localStorage.setItem("theme", "dark");
    } else if (themeDropdown.value === "high-contrast") {
      body.classList = "high-contrast-mode";
      localStorage.setItem("theme", "high-contrast");
    }
  });
});
