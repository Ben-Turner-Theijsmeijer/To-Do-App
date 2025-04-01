import Task from "./task.js";

document.addEventListener("DOMContentLoaded", function() {
  // Function to load tasks from local storage
  const loadTasksFromLocalStorage = () => {
    const taskList = JSON.parse(localStorage.getItem("taskList")) || [];
    let tasks = taskList.map(taskData => Object.assign(new Task(), taskData));

    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      const targetColumn = document.getElementById(
        `${task.priority === "Low"
          ? "low"
          : task.priority === "Medium"
            ? "medium"
            : task.priority === "High" ? "high" : "backlog"}-list`
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
    taskElement.draggable = true;
    taskElement.ondragstart = drag;

    // Create the content for the task
    taskElement.innerHTML = `
            <strong>${task.name}</strong>
            ${task.description == null || task.description == ""
              ? ""
              : `<div class="task-desc" tabindex="0">
                <i class="fa-solid fa-info-circle"></i>
                <i id="chevron" class="fa-solid fa-chevron-right fa-2xs"></i>
                <span class="description-box" id="description" style="display:none;">${task.description}</span>
                </div>`}
            <div class="task-details">
                ${task.recurring
                  ? `<span class="tag recurring recurring-tag">${task.recurring}</span>`
                  : ""}
                ${task.category
                  ? `<span class="tag category category-tag">${task.category}</span>`
                  : ""}         
            </div>
        `;

    // Add the delete button (X) to each task
    taskElement.innerHTML += `
            <button class="delete-btn">
                <i class="fa-solid fa-times"></i>
            </button>
        `;

    const deleteBtn = taskElement.querySelector(".delete-btn");

    const handleDelete = e => {
      deleteTaskFromLocalStorage(task); // Delete task from local storage
      taskElement.remove(); // Remove task from UI
      updateTasksCount(); // Recalculate task count after deletion
    };

    deleteBtn.addEventListener("click", handleDelete);

    // add event listener to toggle description visibility
    if (task.description != null && task.description != "") {
      const desc = taskElement.querySelector("#description");
      const chevron = taskElement.querySelector("#chevron");
      const descDiv = taskElement.querySelector(".task-desc");

      const viewDescription = (e) => {
        if (e.type === "click" || (e.type === "keypress" && e.key === "Enter")){
          desc.style.display = desc.style.display == "none" ? "block" : "none";
          chevron.classList.toggle("fa-rotate-90");
        }
      }
      
      descDiv.addEventListener("click", viewDescription);
      descDiv.addEventListener("keypress", viewDescription);
    }

    // Determine the correct task class (e.g., low-task, medium-task, high-task, or backlog-task)
    if (task.priority === "Low") {
      taskElement.classList.add("low-task");
    } else if (task.priority === "Medium") {
      taskElement.classList.add("medium-task");
    } else if (task.priority === "High") {
      taskElement.classList.add("high-task");
    } else {
      taskElement.classList.add("backlog-task");
    }

    return taskElement;
  };

  // Function to handle task dragging
  const drag = event => {
    event.dataTransfer.setData("text", event.target.id);
  };

  // Function to handle dropping a task
  const drop = event => {
    event.preventDefault();
    let taskID = event.dataTransfer.getData("text");

    if (event.target.classList.contains("task")) return;

    const task = document.getElementById(taskID);
    event.target.appendChild(task);

    // Determine the new class for the task based on the drop target column
    if (event.target.id === "low-list") {
      task.classList.remove("medium-task", "high-task", "backlog-task");
      task.classList.add("low-task");
    } else if (event.target.id === "medium-list") {
      task.classList.remove("low-task", "high-task", "backlog-task");
      task.classList.add("medium-task");
    } else if (event.target.id === "high-list") {
      task.classList.remove("low-task", "medium-task", "backlog-task");
      task.classList.add("high-task");
    } else if (event.target.id === "backlog-list") {
      task.classList.remove("low-task", "medium-task", "high-task");
      task.classList.add("backlog-task");
    }

    updateTasksCount();
  };

  // Function to handle allowing task to drop
  const allowdrop = event => {
    event.preventDefault();
  };

  // Function to update task counts in each column
  const updateTasksCount = () => {
    const backlogColumn = document.getElementById("backlog");
    const lowColumn = document.getElementById("low");
    const mediumColumn = document.getElementById("medium");
    const highColumn = document.getElementById("high");

    const backlogHeader = document.getElementById("backlog-header");
    const lowHeader = document.getElementById("low-header");
    const mediumHeader = document.getElementById("medium-header");
    const highHeader = document.getElementById("high-header");

    // Update task counts and headers for each section
    updateHeader("No Priority", backlogHeader, backlogColumn, "#FFC107");
    updateHeader("Low", lowHeader, lowColumn, "#007BFF");
    updateHeader("Medium", mediumHeader, mediumColumn, "#FF8000");
    updateHeader("High", highHeader, highColumn, "#FF0000");
  };

  // Function to update the header text with the correct task count
  const updateHeader = (title, header, column, color) => {
    const taskCount = column.querySelectorAll(".task").length; // Count task elements
    const taskLabel = taskCount === 1 ? "Task" : "Tasks"; // Singular or plural form based on count
    header.innerHTML = `<span style="font-weight: bold; color: ${color};">${title} (<span style="color: ${color}">${taskCount} ${taskLabel}</span>)</span>`;
  };

  // Function to delete the task from local storage
  const deleteTaskFromLocalStorage = taskToDelete => {
    const taskList = JSON.parse(localStorage.getItem("taskList")) || [];
    const updatedTaskList = taskList.filter(
      task =>
        task.name !== taskToDelete.name ||
        task.priority !== taskToDelete.priority
    ); // Assuming unique task based on name & priority
    localStorage.setItem("taskList", JSON.stringify(updatedTaskList));
  };

  // Load tasks when the page is ready
  loadTasksFromLocalStorage();
});
