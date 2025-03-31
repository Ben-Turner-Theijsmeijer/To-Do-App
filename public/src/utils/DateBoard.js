import Task from "./task.js";

document.addEventListener("DOMContentLoaded", function() {
  // Function to load tasks from local storage
  const loadTasksFromLocalStorage = () => {
    const taskList = JSON.parse(localStorage.getItem("taskList")) || [];
    let tasks = taskList.map(taskData => Object.assign(new Task(), taskData));

    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      const targetColumn = document.getElementById(
        `${task.completed
          ? "complete"
          : task.date === ""
            ? "backlog"
            : task.isOverdue() == "overdue" ? "overdue" : "upcoming"}-list`
      );
      targetColumn.appendChild(taskElement);
    });

    updateTasksCount();
  };

  // Function to create a task element dynamically
  const createTaskElement = task => {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.id = task.name; // Assuming name is unique
    // taskElement.draggable = true;
    // taskElement.ondragstart = drag;

    // Create the content for the task
    taskElement.innerHTML = `
            <div ${task.isOverdue() == "overdue"
              ? 'class="overdue-tooltip"'
              : ""}
                ${task.isOverdue() == "due" ? 'class="due-tooltip"' : ""}>
                ${task.isOverdue() == "overdue" ? `<span>⚠️</span>` : ""}
                ${task.isOverdue() == "due" ? `<span>🕓</span>` : ""}
                <strong>${task.name}</strong> ${task.date == ""
      ? ""
      : ","} ${task.date}
            </div>
            ${task.description == null
              ? ""
              : `<div class="task-desc">
                <i class="fa-solid fa-info-circle"></i>
                <i id="chevron" class="fa-solid fa-chevron-right fa-2xs"></i>
                <span class="description-box" id="description" style="display:none;">${task.description}</span>
                </div>`}
            <div class="task-details">
                ${task.recurring
                  ? `<span class="tag recurring ${task.recurring
                      ? `recurring-tag`
                      : ""}">${task.recurring}</span>`
                  : ""}
                ${task.category
                  ? `<span class="tag category ${task.category
                      ? `category-tag`
                      : ""}">${task.category}</span>`
                  : ""}
                ${task.priority
                  ? `<span class="tag priority ${task.priority
                      ? `priority-${task.priority}`
                      : ""}">${task.priority}</span>`
                  : ""}
            </div>
        `;

    //Note: https://stackoverflow.com/questions/22512467/addeventlistener-will-not-attach-a-listener-to-the-element
    // Add the delete button (X) to each task
    taskElement.innerHTML += `
            <div class="delete-btn">
                <i class="fa-solid fa-times"></i>
            </div>
        `;

    // Add event listener to the delete button (X)
    const deleteBtn = taskElement.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      deleteTaskFromLocalStorage(task); // Delete task from local storage
      taskElement.remove(); // Remove task from UI
      updateTasksCount(); // Recalculate task count after deletion
    });

    // add event listener to toggle description visibility
    if (task.description != null) {
      const desc = taskElement.querySelector("#description");
      const chevron = taskElement.querySelector("#chevron");
      const descDiv = taskElement.querySelector(".task-desc");

      console.log(descDiv);
      descDiv.addEventListener("click", () => {
        desc.style.display = desc.style.display == "none" ? "block" : "none";
        chevron.classList.toggle("fa-rotate-90");
      });
    }

    // Determine the correct task column and apply the correct class (e.g., upcoming-task, backlog-task, overdue-task, or complete-task)
    if (task.completed === true) {
      taskElement.classList.add("complete-task");
    } else if (task.date === "") {
      taskElement.classList.add("backlog-task");
    } else if (!task.complete && task.isOverdue() !== "overdue") {
      taskElement.classList.add("upcoming-task"); // Make sure upcoming-task is used here
    } else if (!task.completed) {
      taskElement.classList.add("overdue-task");
    } else {
      taskElement.classList.add("backlog-task");
    }

    return taskElement;
  };

  // Function to update task counts
  // Function to update the task count in each column header
  const updateTasksCount = () => {
    const backlogColumn = document.getElementById("backlog");
    const upcomingColumn = document.getElementById("upcoming");
    const overdueColumn = document.getElementById("overdue");
    const completeColumn = document.getElementById("complete");

    const backlogHeader = document.getElementById("backlog-header");
    const upcomingHeader = document.getElementById("upcoming-header");
    const overdueHeader = document.getElementById("overdue-header");
    const completeHeader = document.getElementById("complete-header");

    // Update task counts and headers for each section
    updateHeader("No date", backlogHeader, backlogColumn, "#FFC107");
    updateHeader("Upcoming", upcomingHeader, upcomingColumn, "#007BFF");
    updateHeader("Overdue", overdueHeader, overdueColumn, "#ff0000");
    updateHeader("Complete", completeHeader, completeColumn, "#28A745");

    hideOverdueBoardVisibility();
  };

  // Function to update the header text with the correct task count
  const updateHeader = (title, header, column, color) => {
    const taskCount = column.querySelectorAll(".task").length; // Counting only task elements
    const taskLabel = taskCount === 1 ? "Task" : "Tasks"; // Singular or plural form based on count
    header.innerHTML = `<span style="font-weight: bold; color: ${color};">${title} (<span style="color: ${color}">${taskCount} ${taskLabel}</span>)</span>`;
  };

  // Function to delete the task from local storage
  const deleteTaskFromLocalStorage = taskToDelete => {
    const taskList = JSON.parse(localStorage.getItem("taskList")) || [];
    const updatedTaskList = taskList.filter(
      task => task.name !== taskToDelete.name || task.date !== taskToDelete.date
    ); // Assuming unique task based on name & date
    localStorage.setItem("taskList", JSON.stringify(updatedTaskList));
  };

  // Hide overdue Tasks board if there are none
  const hideOverdueBoardVisibility = () => {
    const overdueTaskList = document.getElementById("overdue-list");
    const overdueBoard = document.getElementById("overdue");
    const overdueHeader = document.getElementById("overdue-header");

    // Check if the overdue task list has any child elements
    if (overdueTaskList.children.length === 0) {
      overdueBoard.style.display = "none";
      overdueHeader.style.display = "none";
    } else {
      overdueBoard.style.display = "block";
      overdueHeader.style.display = "block";
    }
  };

  // Call `updateTasksCount` whenever the page or task list changes (like onload or after any task manipulation)
  document.addEventListener("DOMContentLoaded", updateTasksCount);

  loadTasksFromLocalStorage(); // Load tasks when the page is ready
});
