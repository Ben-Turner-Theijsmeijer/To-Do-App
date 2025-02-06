// const {checkIcon} = require('./UIManager')
class TaskManager {
  constructor(taskList) {
    // I actually dont think we need anything in the constructor... we are all getting the input from the selector right as the buttons are clicked... not before
    // this.nameInput = nameInput;
    // this.dateInput = dateInput;
    // this.timeInput = timeInput;
    // this.categoryInput = categoryInput;
    // this.priorityInput = priorityInput;
    // this.completedInput = completedInput;

    this.taskList = taskList;
    this.isEditing = false;
    this.editIndex = null;
    
    TaskManager.setDefaultDateTime();
  }

    // ORIGINAL FUNCTIONS PORTED OVER

  // Honestly... this should be in the manager - it sets the date and time for the initial load in
  static setDefaultDateTime() {
    const inputDateElement = document.querySelector('.js-date-input');
    const inputTimeElement = document.querySelector('.js-time-input');

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].slice(0, 5);

    inputDateElement.value = date;
    inputDateElement.min = date; // Set the min attribute to today's date
    inputTimeElement.value = time;
    inputTimeElement.min = time; // Set the min attribute to current time
  }

  editTodo(index) {
    let inputNameElement = document.querySelector('.js-name-input');
    let inputDateElement = document.querySelector('.js-date-input');
    let inputTimeElement = document.querySelector('.js-time-input');
    let inputCategoryElement = document.querySelector('.js-category-input');
    let inputPriorityElement = document.querySelector('.js-priority-input');

    // Fill the input fields with the current values
    inputNameElement.value = this.taskList[index].name;
    inputDateElement.value = this.taskList[index].date;
    inputTimeElement.value = this.taskList[index].time;
    inputCategoryElement.value = this.taskList[index].category;
    inputPriorityElement.value = this.taskList[index].priority;

    // Set editing mode and the index of the todo being edited
    this.isEditing = true;
    this.editIndex = index;

    // Enable cancel option
    const cancelEditBtn = document.querySelector('.js-cancel-button');
    cancelEditBtn.style.display = 'block';

    // Change the add button to 'Update'
    const addButton = document.querySelector('.js-add-button');
    addButton.innerHTML = '';
    addButton.title = 'Update';

    const checkIcon  = document.getElementById("checkIcon")
    // console.log(checkIcon);
    addButton.appendChild(checkIcon);
    //why is edit even calling this? it should only be create/delete
    // updateTaskCounter(); 
  }

  cancelEditTodo() {
    this.isEditing = false; // Reset edit mode
    this.editIndex = null;

    // Reset the inputs
    TaskManager.clearInputs();

    // Hide edit cancel action button on page load
    const cancelEditBtn = document.querySelector('.js-cancel-button');
    cancelEditBtn.style.display = 'none';

    // Change the button back to 'Add'
    const addButton = document.querySelector('.js-add-button');
    addButton.innerHTML = '';
    addButton.title = 'Add';
    
    const foundIcon = document.getElementById('addIcon');
    console.log(foundIcon);
    // addButton.appendChild(foundIcon);
    // updateTaskCounter();
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
    this.setDefaultDateTime();
  }
}

export default TaskManager;