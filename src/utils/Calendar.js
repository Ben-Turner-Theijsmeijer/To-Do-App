document.addEventListener("DOMContentLoaded", function () {
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
  });