import Task from "./task.js";

document.addEventListener("DOMContentLoaded", function() {
  // Function to load tasks from local storage
  const loadTasksFromLocalStorage = () => {
    const taskList = JSON.parse(localStorage.getItem("taskList")) || [];
    console.log(taskList);
    let tasks = taskList.map(taskData => Object.assign(new Task(), taskData));

    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      const targetColumn = document.getElementById(
        `${task.category === "Work"
          ? "work"
          : task.category === "Personal"
            ? "personal"
            : task.category === "Shopping" ? "shopping" : "backlog"}-list`
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
                ${task.priority
                  ? `<span class="tag priority ${task.priority
                      ? `priority-${task.priority}`
                      : ""}">${task.priority}</span>`
                  : ""}
            </div>
        `;

    // Add the delete button (X) to each task
    taskElement.innerHTML += `
            <button class="delete-btn">
                <i class="fa-solid fa-times"></i>
            </button>
        `;

    // Add event listener to the delete button (X)
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

      const viewDescription = e => {
        if (
          e.type === "click" ||
          (e.type === "keypress" && e.key === "Enter")
        ) {
          desc.style.display = desc.style.display == "none" ? "block" : "none";
          chevron.classList.toggle("fa-rotate-90");
        }
      };

      descDiv.addEventListener("click", viewDescription);
      descDiv.addEventListener("keypress", viewDescription);
    }

    // Determine the correct task class (e.g., low-task, medium-task, high-task, or backlog-task)
    if (task.category === "Work") {
      taskElement.classList.add("work-task");
    } else if (task.category === "Personal") {
      taskElement.classList.add("personal-task");
    } else if (task.category === "Shopping") {
      taskElement.classList.add("shopping-task");
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
    if (event.target.id === "work-list") {
      task.classList.remove("personal-task", "shopping-task", "backlog-task");
      task.classList.add("work-task");
    } else if (event.target.id === "personal-list") {
      task.classList.remove("work-task", "shopping-task", "backlog-task");
      task.classList.add("personal-task");
    } else if (event.target.id === "shopping-list") {
      task.classList.remove("work-task", "personal-task", "backlog-task");
      task.classList.add("shopping-task");
    } else if (event.target.id === "backlog-list") {
      task.classList.remove("work-task", "personal-task", "shopping-task");
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
    const workColumn = document.getElementById("work");
    const personalColumn = document.getElementById("personal");
    const shoppingColumn = document.getElementById("shopping");

    const backlogHeader = document.getElementById("backlog-header");
    const workHeader = document.getElementById("work-header");
    const personalHeader = document.getElementById("personal-header");
    const shoppingHeader = document.getElementById("shopping-header");

    // Update task counts and headers for each section
    updateHeader("None/Other", backlogHeader, backlogColumn);
    updateHeader("Work", workHeader, workColumn);
    updateHeader("Personal", personalHeader, personalColumn);
    updateHeader("Shopping", shoppingHeader, shoppingColumn);
  };

  // Function to update the header text with the correct task count
  const updateHeader = (title, header, column) => {
    const taskCount = column.querySelectorAll(".task").length; // Count task elements
    const taskLabel = taskCount === 1 ? "Task" : "Tasks"; // Singular or plural form based on count
    header.innerHTML = `${title} (${taskCount} ${taskLabel})`;
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
