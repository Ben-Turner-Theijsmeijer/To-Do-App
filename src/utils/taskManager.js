class TaskManager {
  constructor(taskList) {
    this.taskList = taskList;
    this.isEditing = false;
    this.editIndex = null;
    this.taskBeingEdited = null;
  }

  static editTask(task) {
    this.taskBeingEdited = task;
    let inputNameElement = document.querySelector('.js-name-input');
    let inputDateElement = document.querySelector('.js-date-input');
    let inputTimeElement = document.querySelector('.js-time-input');
    let inputCategoryElement = document.querySelector('.js-category-input');
    let inputPriorityElement = document.querySelector('.js-priority-input');

    // Fill the input fields with the current values
    inputNameElement.value = task.name;
    inputDateElement.value = task.date;
    inputTimeElement.value = task.time;
    inputCategoryElement.value = task.category;
    inputPriorityElement.value = task.priority;

    // Enable the time input field if it was previously disabled
    inputTimeElement.disabled = false;  // Enable the time input

    // Set editing mode and the index of the task being edited
    this.isEditing = true;

    // Enable cancel option
    const cancelEditBtn = document.querySelector(".js-cancel-button");
    cancelEditBtn.style.display = "";

    // Change the add button to 'Update'
    const addButton = document.querySelector(".js-add-button");
    addButton.innerHTML = " Update";
    addButton.title = "Update";

    // Add checkmark icon
    const checkIcon = document.createElement("span");
    checkIcon.classList.add("fa-solid", "fa-check");
    addButton.prepend(checkIcon);
  }

  cancelEditTask() {
    this.isEditing = false; // Reset edit mode
    this.editIndex = null; // might not use this anymore

    // Reset the inputs
    TaskManager.clearInputs();

    // Hide edit cancel action button on page load
    const cancelEditBtn = document.querySelector(".js-cancel-button");
    cancelEditBtn.style.display = "none";

    // Change the button back to 'Add'
    const addButton = document.querySelector(".js-add-button");
    addButton.innerHTML = " Add Task";
    addButton.title = "Add";

    // add plus icon
    const addIcon = document.createElement("span");
    addIcon.classList.add("fa-solid", "fa-add");
    addButton.prepend(addIcon);
  }

  static getTaskBeingEdited() {
    return this.taskBeingEdited;
  }

  static clearInputs() {
    const inputNameElement = document.querySelector('.js-name-input');
    const inputDateElement = document.querySelector('.js-date-input');
    const inputTimeElement = document.querySelector('.js-time-input');
    const inputCategoryElement = document.querySelector('.js-category-input');
    const inputPriorityElement = document.querySelector('.js-priority-input');

    // Clear the inputs
    inputNameElement.value = '';
    inputDateElement.value = '';
    inputTimeElement.value = '';
    inputCategoryElement.value = '';
    inputPriorityElement.value = '';
  }

  static getIsEditing() {
    return this.isEditing;
  }

  static setIsEditing(status) {
    this.isEditing = status;
  }
}

export default TaskManager;
