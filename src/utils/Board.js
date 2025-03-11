import Task from "./task.js";

document.addEventListener("DOMContentLoaded", function() {
    // Function to toggle between light and dark mode
    document.getElementById("themesSelection").addEventListener("change", (event) => {
        if (event.target.value === "dark") {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    });

    // Function to load tasks from local storage
    const loadTasksFromLocalStorage = () => {
        const taskList = JSON.parse(localStorage.getItem("taskList")) || [];
        let tasks = taskList.map(taskData => Object.assign(new Task(), taskData)); 

        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            const targetColumn = document.getElementById(`${task.completed ? "complete" : task.date === "" ? "backlog" : "upcoming"}-list`);
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
            <div>
                ${task.isOverdue()}
                <strong>${task.name}</strong>, ${task.date}
            </div> <!-- Name and Date -->
            <div class="task-details">
                ${task.recurring ? `<span class="tag recurring ${task.recurring ? `recurring-tag` : ""}">${task.recurring}</span>` : ""}
                ${task.category ? `<span class="tag category ${task.category ? `category-tag` : ""}">${task.category}</span>` : ""}
                ${task.priority ? `<span class="tag priority ${task.priority ? `priority-${task.priority}` : ""}">${task.priority}</span>` : ""}
            </div>
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
            deleteTaskFromLocalStorage(task);  // Delete task from local storage
            taskElement.remove();  // Remove task from UI
            updateTasksCount();  // Recalculate task count after deletion
        });

        // Determine the correct task column and apply the correct class (e.g., upcoming-task, backlog-task, or complete-task)
        if (task.date === "") {
            taskElement.classList.add("backlog-task"); 
        } else if (!task.completed) {
            taskElement.classList.add("upcoming-task"); // Make sure upcoming-task is used here
        } else {
            taskElement.classList.add("complete-task");
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
        if (event.target.id === "upcoming-list") {
            task.classList.remove("backlog-task", "complete-task");
            task.classList.add("upcoming-task"); // Assign upcoming-task class
        } else if (event.target.id === "backlog-list") {
            task.classList.remove("upcoming-task", "complete-task");
            task.classList.add("backlog-task"); // Assign backlog-task class
        } else if (event.target.id === "complete-list") {
            task.classList.remove("backlog-task", "upcoming-task");
            task.classList.add("complete-task"); // Assign complete-task class
        }

        updateTasksCount();
    };

    // Function to handle allowing task to drop
    const allowdrop = (event) => {
        event.preventDefault();
    };

    // Function to update task counts
    // Function to update the task count in each column header
    const updateTasksCount = () => {
        const backlogColumn = document.getElementById("backlog");
        const upcomingColumn = document.getElementById("upcoming");
        const completeColumn = document.getElementById("complete");

        const backlogHeader = document.getElementById("backlog-header");
        const upcomingHeader = document.getElementById("upcoming-header");
        const completeHeader = document.getElementById("complete-header");

        // Update task counts and headers for each section
        updateHeader("Backlog: No date", backlogHeader, backlogColumn, "#FFC107");
        updateHeader("Upcoming", upcomingHeader, upcomingColumn, "#007BFF");
        updateHeader("Complete", completeHeader, completeColumn, "#28A745");
    };

    // Function to update the header text with the correct task count
    const updateHeader = (title, header, column, color) => {
        const taskCount = column.querySelectorAll('.task').length;  // Counting only task elements
        const taskLabel = taskCount === 1 ? "Task" : "Tasks";  // Singular or plural form based on count
        header.innerHTML = `<span style="font-weight: bold; color: ${color};">${title} (<span style="color: ${color}">${taskCount} ${taskLabel}</span>)</span>`;
    };

    // Function to delete the task from local storage
    const deleteTaskFromLocalStorage = (taskToDelete) => {
        const taskList = JSON.parse(localStorage.getItem("taskList")) || [];
        const updatedTaskList = taskList.filter(task => task.name !== taskToDelete.name || task.date !== taskToDelete.date); // Assuming unique task based on name & date
        localStorage.setItem("taskList", JSON.stringify(updatedTaskList));
    };

    // Example of adding a new task (ensure task count updates after adding/removing tasks)
    const addTask = (task) => {
        const upcomingColumn = document.getElementById("upcoming");
        upcomingColumn.appendChild(createTaskElement(task));  // Render task with delete button
        updateTasksCount();  // Recalculate task count after adding a new task
    };

    // Example of removing a task (ensure task count updates after removal)
    const removeTask = (task) => {
        task.remove();
        updateTasksCount();  // Recalculate task count after removing a task
    };

    // Call `updateTasksCount` whenever the page or task list changes (like onload or after any task manipulation)
    document.addEventListener("DOMContentLoaded", updateTasksCount);

    loadTasksFromLocalStorage(); // Load tasks when the page is ready
});
