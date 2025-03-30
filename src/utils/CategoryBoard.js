import Task from "./task.js";

document.addEventListener("DOMContentLoaded", function() {
    // Function to load tasks from local storage
    const loadTasksFromLocalStorage = () => {
        const taskList = JSON.parse(localStorage.getItem("taskList")) || [];
        console.log (taskList);
        let tasks = taskList.map(taskData => Object.assign(new Task(), taskData)); 

        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            const targetColumn = document.getElementById(`${task.category === "Work" ? "work" : task.category === "Personal" ? "personal" : task.category === "Shopping" ? "shopping" : "backlog"}-list`);
            targetColumn.appendChild(taskElement);
        });

        updateTasksCount();
    };

    // Function to create a task element dynamically
    const createTaskElement = (task) => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task");
        taskElement.id = task.name; // Assuming name is unique
        taskElement.draggable = true;
        taskElement.ondragstart = drag;

        // Create the content for the task
        taskElement.innerHTML = `
            <strong>${task.name}</strong>
            <div class="task-details">
                ${task.recurring ? `<span class="tag recurring recurring-tag">${task.recurring}</span>` : ""}
                ${task.priority ? `<span class="tag priority ${task.priority ? `priority-${task.priority}` : ""}">${task.priority}</span>` : ""}
        `;

        // Add the delete button (X) to each task
        taskElement.innerHTML += `
            <div class="delete-btn">
                <i class="fa-solid fa-times"></i>
            </div>
        `;

        // Add event listener to the delete button (X)
        const deleteBtn = taskElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteTaskFromLocalStorage(task); // Delete task from local storage
            taskElement.remove(); // Remove task from UI
            updateTasksCount(); // Recalculate task count after deletion
        });

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
    const drag = (event) => {
        event.dataTransfer.setData("text", event.target.id);
    };

    // Function to handle dropping a task
    const drop = (event) => {
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
    const allowdrop = (event) => {
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
        updateHeader("None/Other", backlogHeader, backlogColumn, "#FFC107");
        updateHeader("Work", workHeader, workColumn, "#007BFF");
        updateHeader("Personal", personalHeader, personalColumn, "#FF8000");
        updateHeader("Shopping", shoppingHeader, shoppingColumn, "#FF0000");
    };

    // Function to update the header text with the correct task count
    const updateHeader = (title, header, column, color) => {
        const taskCount = column.querySelectorAll('.task').length; // Count task elements
        const taskLabel = taskCount === 1 ? "Task" : "Tasks"; // Singular or plural form based on count
        header.innerHTML = `<span style="font-weight: bold; color: ${color};">${title} (<span style="color: ${color}">${taskCount} ${taskLabel}</span>)</span>`;
    };

    // Function to delete the task from local storage
    const deleteTaskFromLocalStorage = (taskToDelete) => {
        const taskList = JSON.parse(localStorage.getItem("taskList")) || [];
        const updatedTaskList = taskList.filter(task => task.name !== taskToDelete.name || task.priority !== taskToDelete.priority); // Assuming unique task based on name & priority
        localStorage.setItem("taskList", JSON.stringify(updatedTaskList));
    };

    // Load tasks when the page is ready
    loadTasksFromLocalStorage();
});
