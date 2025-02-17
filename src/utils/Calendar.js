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

document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");
    const currentDateEl = document.getElementById("currentDate");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const todayBtn = document.getElementById("todayBtn");
    const monthViewBtn = document.getElementById("monthViewBtn");
    const weekViewBtn = document.getElementById("weekViewBtn");

    let viewMode = "month"; // Default view
    let currentDate = new Date();

    function renderCalendar() {
        console.log("Rendering Calendar", viewMode, currentDate);

        calendarEl.innerHTML = ""; // Clear existing content
        currentDateEl.textContent = currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });

        if (viewMode === "month") {
            renderMonthView();
        } else {
            renderWeekView();
        }
    }

    function renderMonthView() {
        let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        let lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        let startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay()); // Adjust to start from Sunday

        let endDate = new Date(lastDay);
        endDate.setDate(endDate.getDate() + (6 - lastDay.getDay())); // Extend to Saturday

        createCalendarGrid(startDate, endDate);
    }

    function renderWeekView() {
        let startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Get Sunday

        let endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6); // Get Saturday

        createCalendarGrid(startOfWeek, endOfWeek);
    }

    function createCalendarGrid(startDate, endDate) {
        console.log("Generating grid from:", startDate, "to:", endDate);
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let table = document.createElement("table");
        table.className = "table table-bordered calendar-table";

        let thead = document.createElement("thead");
        let headerRow = document.createElement("tr");

        daysOfWeek.forEach(day => {
            let th = document.createElement("th");
            th.textContent = day;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        let tbody = document.createElement("tbody");
        let row = document.createElement("tr");
        let dateIterator = new Date(startDate);

        // Loop through each day in the calendar grid
        while (dateIterator <= endDate) {
            let cell = document.createElement("td");

            // Check if the current date is within the current month
            if (dateIterator.getMonth() === currentDate.getMonth()) {
                cell.textContent = dateIterator.getDate();

                // Highlight today's date
                if (dateIterator.toDateString() === new Date().toDateString()) {
                    cell.classList.add("today");
                }
            } else {
                // Leave the cell empty if it's outside the current month
                cell.classList.add("empty");
            }

            row.appendChild(cell);

            // Move to next row if the current day is Saturday
            if (dateIterator.getDay() === 6) {
                tbody.appendChild(row);
                row = document.createElement("tr");
            }

            // Move to the next day
            dateIterator.setDate(dateIterator.getDate() + 1);
        }

        // Append the last row
        tbody.appendChild(row);
        table.appendChild(tbody);
        calendarEl.appendChild(table);
    }

    prevBtn.addEventListener("click", function () {
        if (viewMode === "month") {
            currentDate.setMonth(currentDate.getMonth() - 1);
        } else {
            currentDate.setDate(currentDate.getDate() - 7);
        }
        renderCalendar();
    });

    nextBtn.addEventListener("click", function () {
        if (viewMode === "month") {
            currentDate.setMonth(currentDate.getMonth() + 1);
        } else {
            currentDate.setDate(currentDate.getDate() + 7);
        }
        renderCalendar();
    });

    todayBtn.addEventListener("click", function () {
        currentDate = new Date();
        renderCalendar();
    });

    monthViewBtn.addEventListener("click", function () {
        viewMode = "month";
        monthViewBtn.classList.add("btn-primary");
        monthViewBtn.classList.remove("btn-outline-primary");
        weekViewBtn.classList.remove("btn-primary");
        weekViewBtn.classList.add("btn-outline-primary");
        renderCalendar();
    });

    weekViewBtn.addEventListener("click", function () {
        viewMode = "week";
        weekViewBtn.classList.add("btn-primary");
        weekViewBtn.classList.remove("btn-outline-primary");
        monthViewBtn.classList.remove("btn-primary");
        monthViewBtn.classList.add("btn-outline-primary");
        renderCalendar();
    });

    renderCalendar();
});
