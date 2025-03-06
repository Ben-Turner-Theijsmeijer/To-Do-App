// Function to toggle between light and dark mode
document.getElementById("themesSelection").addEventListener("change", (event) => {
    if (event.target.value === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
});

// Function : Task Drop Function
const drop = (event) => {
    event.preventDefault();
    let taskID = event.dataTransfer.getData("text");

    // Prevent dropping a Task onto another Task
    if (event.target.classList.contains("task")) return;

    const task = document.getElementById(taskID);
    event.target.appendChild(task);

    // Update Task Border & Background Color based on new column
    updateTaskBorder(task, event.target.id);

    updateTasksCount();
}

// Function : Allow Task to Drop Function
const allowdrop = (event) => {
    event.preventDefault();
}

// Function : Task Drag Function
const drag = (event) => {
    event.dataTransfer.setData("text", event.target.id);
}

// Function : Update Task(s) Count
const updateTasksCount = () => {
    const backlogColumn = document.getElementById("backlog");
    const upcomingColumn = document.getElementById("upcoming");
    const completeColumn = document.getElementById("complete");

    const backlogHeader = document.getElementById("backlog-header");
    const upcomingHeader = document.getElementById("upcoming-header");
    const completeHeader = document.getElementById("complete-header");

    updateHeader("Backlog: No date", backlogHeader, backlogColumn, "#FFC107");
    updateHeader("Upcoming", upcomingHeader, upcomingColumn, "#007BFF");
    updateHeader("Complete", completeHeader, completeColumn, "#28A745");
}

// Function : Update Header
const updateHeader = (title, header, column, color) => {
    const taskCount = column.children.length;
    const taskLabel = taskCount === 1 ? "Task" : "Tasks";
    header.innerHTML = `<span style="font-weight: bold; color: ${color};">${title} (<span style="color: ${color}">${taskCount} ${taskLabel}</span>)`;
}

// Function : Update Task Border & Background Color based on Column
const updateTaskBorder = (task, columnID) => {
    task.classList.remove("backlog-task", "upcoming-task", "complete-task");

    if (columnID === "backlog") {
        task.classList.add("backlog-task"); // Yellow
    } else if (columnID === "upcoming") {
        task.classList.add("upcoming-task"); // Blue
    } else if (columnID === "complete") {
        task.classList.add("complete-task"); // Green
    }
}

updateTasksCount();
