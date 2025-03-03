document.addEventListener("DOMContentLoaded", function () {
  // DARK MODE
  const darkModeBtn = document.getElementById("darkModeBtn");
  const body = document.body;

  // Check for saved preference in localStorage
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
    darkModeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
  }

  // Toggle dark mode
  darkModeBtn.addEventListener("click", function () {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
      darkModeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
    } else {
      localStorage.setItem("darkMode", "disabled");
      darkModeBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode';
    }
  });

  // HIGH CONSTRAST MODE
  const highContrastModeBtn = document.getElementById("highContrastModeBtn");

  // Load high contrast mode preference
  if (localStorage.getItem("highContrastMode") === "enabled") {
    body.classList.add("high-contrast-mode");
    highContrastModeBtn.innerHTML = '<i class="fa-solid fa-circle-half-stroke"></i> High Contrast On';
  }

  // Toggle high contrast mode
  highContrastModeBtn.addEventListener("click", function () {
    body.classList.toggle("high-contrast-mode");

    if (body.classList.contains("high-contrast-mode")) {
      localStorage.setItem("highContrastMode", "enabled");
      highContrastModeBtn.innerHTML = '<i class="fa-solid fa-circle-half-stroke"></i> High Contrast On';
    } else {
      localStorage.setItem("highContrastMode", "disabled");
      highContrastModeBtn.innerHTML = '<i class="fa-solid fa-circle-half-stroke"></i> High Contrast Off';
    }
  });
});