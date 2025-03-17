import Task from "./task.js";
import TaskList from "./taskList.js";

class Calendar {
  constructor() {
    this.body = document.body;
    this.themeSelection = document.getElementById("themesSelection");
    this.calendarEl = document.getElementById("calendar");
    this.currentDateEl = document.getElementById("currentDate");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.todayBtn = document.getElementById("todayBtn");
    this.monthViewBtn = document.getElementById("monthViewBtn");
    this.weekViewBtn = document.getElementById("weekViewBtn");

    this.viewMode = "month";
    this.currentDate = new Date();
    this.taskList = this.getTaskList();

    this.initDarkMode();
    this.addEventListeners();
    this.renderCalendar();
    this.addTasksWithNoDate();
  }

  getTaskList() {
    const storedTasks = JSON.parse(localStorage.getItem("taskList")) || [];
    console.log(storedTasks);
    return storedTasks.map(
      taskData =>
        new Task(
          taskData.name,
          taskData.date,
          taskData.time,
          taskData.category,
          taskData.priority,
          taskData.completed,
          taskData.recurring
        )
    );
  }

  initDarkMode() {
    if (localStorage.getItem("darkMode") === "enabled") {
      this.body.classList.add("dark-mode");
      this.themeSelection.value = "dark";
      this.themeSelection.innerHTML = "Dark Mode";
    }
  }

  addEventListeners() {
    // this.darkModeBtn.addEventListener("click", () => this.toggleDarkMode());
    this.prevBtn.addEventListener("click", () => this.changeDate(-1));
    this.nextBtn.addEventListener("click", () => this.changeDate(1));
    this.todayBtn.addEventListener("click", () => this.goToToday());
    this.monthViewBtn.addEventListener("click", () => this.setView("month"));
    this.weekViewBtn.addEventListener("click", () => this.setView("week"));
  }

  changeDate(offset) {
    if (this.viewMode === "month") {
      this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    } else {
      this.currentDate.setDate(this.currentDate.getDate() + offset * 7);
    }
    this.renderCalendar();
  }

  goToToday() {
    this.currentDate = new Date();
    this.renderCalendar();
  }

  setView(view) {
    this.viewMode = view;
    this.renderCalendar();
  }

  renderCalendar() {
    this.taskList = this.getTaskList(); // Ensure updated task list
    this.calendarEl.innerHTML = "";
    this.currentDateEl.textContent = this.currentDate.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric"
      }
    );

    if (this.viewMode === "month") {
      this.renderMonthView();
    } else {
      this.renderWeekView();
    }
  }

  renderMonthView() {
    let firstDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    let lastDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    );
    let startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    let endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    this.createCalendarGrid(startDate, endDate);
  }

  renderWeekView() {
    let startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    let endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    this.createCalendarGrid(startOfWeek, endOfWeek);
  }

  createCalendarGrid(startDate, endDate) {
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

    while (dateIterator <= endDate) {
      let cell = document.createElement("td");
      cell.classList.add("calendar-cell");
      if (dateIterator.getMonth() === this.currentDate.getMonth()) {
        cell.textContent = dateIterator.getDate();
        if (dateIterator.toDateString() === new Date().toDateString()) {
          cell.classList.add("today");
        }
        this.addTasksToCell(cell, dateIterator);
      } else {
        cell.classList.add("empty");
      }
      row.appendChild(cell);
      if (dateIterator.getDay() === 6) {
        tbody.appendChild(row);
        row = document.createElement("tr");
      }
      dateIterator.setDate(dateIterator.getDate() + 1);
    }
    tbody.appendChild(row);
    table.appendChild(tbody);
    this.calendarEl.appendChild(table);
  }

  popupTaskDetails(task) {
    // containing element
    const taskDetailsPopup = document.getElementById("taskDetails");
    taskDetailsPopup.style.display = "block";
    // name & completion status
    const nameAndIsComplete = document.getElementById(
      "taskDetailsNameAndStatus"
    );
    const completionStatus = task.completed ? " (Complete)" : "";
    nameAndIsComplete.innerText = task.name + completionStatus;
    // date and time
    const dateTime = document.getElementById("taskDetailsDateTime");
    const dateStr = task.date != "" ? task.date : "";
    const timeStr = task.time != "" ? ", " + task.time : "";
    dateTime.innerText = dateStr + timeStr;
    // category and priority
    const catPri = document.getElementById("calendarTaskTags");
    calendarTaskTags.innerHTML = "";
    if (task.recurring != "") {
      console.log(task);
      const recurring = document.createElement("span");
      recurring.classList.add("recurring-tag");
      recurring.innerText = task.recurring;
      calendarTaskTags.appendChild(recurring);
    }
    if (task.category != "") {
      const category = document.createElement("span");
      category.classList.add("category-tag");
      category.innerText = task.category;
      calendarTaskTags.appendChild(category);
    }
    if (task.priority != "") {
      const priority = document.createElement("span");
      priority.classList.add("priority-tag");
      priority.classList.add(`priority-${task.priority}`);
      priority.innerText = task.priority;
      calendarTaskTags.appendChild(priority);
    }
  }

  addTasksToCell(cell, date) {
    const tasksForDate = this.taskList.filter(
      task => task.date === date.toISOString().split("T")[0]
    );

    if (tasksForDate.length > 0) {
      let taskContainer = document.createElement("div");
      taskContainer.classList.add("task-container");

      tasksForDate.forEach(task => {
        let taskLabel = document.createElement("div");
        taskLabel.classList.add("task-label");
        taskLabel.textContent =
          task.name.length > 10 ? task.name.slice(0, 10) + "..." : task.name;
        taskLabel.title = task.name; // Full task name on hover
        taskLabel.onclick = () => this.popupTaskDetails(task); // Optional: Click to show full task name

        taskContainer.appendChild(taskLabel);
      });

      cell.appendChild(taskContainer);
    }
  }

  addTasksWithNoDate() {
    const tasksWithoutDate = this.taskList.filter(task => task.date === "");
    if (tasksWithoutDate.length > 0) {
      // get parent container
      const parent = document.getElementById("calendarAndDateless");
      // container with list of tasks
      const noDateContainer = document.createElement("div");
      noDateContainer.classList = "container-cal mt-4";
      noDateContainer.id = "noDateContainer";
      // create subtitle?
      const subtitle = document.createElement("h2");
      subtitle.innerHTML = "No Due Date";
      noDateContainer.appendChild(subtitle);
      // render tasks
      tasksWithoutDate.forEach(task => {
        if (!task.completed) {
          const el = this.createTaskWithoutDateDiv(task);
          noDateContainer.appendChild(el);
        }
      });
      // show on screen
      parent.appendChild(noDateContainer);
    }
  }

  createTaskWithoutDateDiv(task) {
    // container
    const taskInfo = document.createElement("div");
    taskInfo.classList = "task-without-due-date";
    // name
    const name = document.createElement("span");
    name.classList = "task-name";
    name.innerText = task.name;
    taskInfo.appendChild(name);
    // category
    if (task.category != "") {
      const category = document.createElement("span");
      category.classList = "category-tag";
      category.innerText = task.category;
      taskInfo.appendChild(category);
    }
    // priority
    if (task.priority != "") {
      const priority = document.createElement("span");
      priority.classList = `priority-tag priority-${task.priority}`;
      priority.innerText = task.priority;
      taskInfo.appendChild(priority);
    }
    return taskInfo;
  }
}

document.addEventListener("DOMContentLoaded", () => new Calendar());
