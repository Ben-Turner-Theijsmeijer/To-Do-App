document.addEventListener("DOMContentLoaded", function () {
  const highContrastModeBtn = document.getElementById("highContrastModeBtn");
  const body = document.body;

  // Load high contrast mode preference
  if (localStorage.getItem("highContrastMode") === "enabled") {
    body.classList.add("high-contrast-mode");
    highContrastModeBtn.innerHTML = '<i class="fa-solid fa-circle-half-stroke fa-rotate-180"></i> High Contrast On';
  }

  // Toggle high contrast mode
  highContrastModeBtn.addEventListener("click", function () {
    body.classList.toggle("high-contrast-mode");

    if (body.classList.contains("high-contrast-mode")) {
      localStorage.setItem("highContrastMode", "enabled");
      highContrastModeBtn.innerHTML = '<i class="fa-solid fa-circle-half-stroke fa-rotate-180"></i> High Contrast On';
    } else {
      localStorage.setItem("highContrastMode", "disabled");
      highContrastModeBtn.innerHTML = '<i class="fa-solid fa-circle-half-stroke"></i> High Contrast Off';
    }
  });
});
