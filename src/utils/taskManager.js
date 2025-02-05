class TaskManager {
  constructor(nameInput, dateInput, timeInput, categoryInput, priorityInput, completedInput) {
    this.nameInput = nameInput;
    this.dateInput = dateInput;
    this.timeInput = timeInput;
    this.categoryInput = categoryInput;
    this.priorityInput = priorityInput;
    this.completedInput = completedInput;
  }

  // ORIGINAL FUNCTIONS PORTED OVER
  editTodo(index) {
    let inputNameElement = document.querySelector('.js-name-input');
    let inputDateElement = document.querySelector('.js-date-input');
    let inputTimeElement = document.querySelector('.js-time-input');
    let inputCategoryElement = document.querySelector('.js-category-input');
    let inputPriorityElement = document.querySelector('.js-priority-input');
  
    // Fill the input fields with the current values
    inputNameElement.value = todoList[index].name;
    inputDateElement.value = todoList[index].date;
    inputTimeElement.value = todoList[index].time;
    inputCategoryElement.value = todoList[index].category;
    inputPriorityElement.value = todoList[index].priority;
  
    // Set editing mode and the index of the todo being edited
    isEditing = true;
    editIndex = index;
  
    // Enable cancel option
    const cancelEditBtn = document.querySelector('.js-cancel-button');
    cancelEditBtn.style.display = 'block';
  
    // Change the add button to 'Update'
    const addButton = document.querySelector('.js-add-button');
    addButton.innerHTML = '';
    addButton.title = 'Update';
    addButton.appendChild(checkIcon);
    updateTaskCounter();
  }

  cancelEditTodo() {
    isEditing = false; // Reset edit mode
    editIndex = null;
  
    // Reset the inputs
    clearInputs();
  
    // Hide edit cancel action button on page load
    const cancelEditBtn = document.querySelector('.js-cancel-button');
    cancelEditBtn.style.display = 'none';
  
    // Change the button back to 'Add'
    const addButton = document.querySelector('.js-add-button');
    addButton.innerHTML = '';
    addButton.title = 'Add';
    addButton.appendChild(addIcon);
    updateTaskCounter();
  }

  clearInputs() {
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
    setDefaultDateTime();
  }
}