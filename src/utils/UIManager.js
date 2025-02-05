class UIManager {
  constructor(taskList) {
      this.taskList = taskList
  }

}

// Initialize the todo list and set default date and time on page load
document.addEventListener('DOMContentLoaded', () => {
  updateTodoList();
  setDefaultDateTime();

  // Set focus on the name input field
  const inputNameElement = document.querySelector('.js-name-input');
  inputNameElement.focus();

  // Hide edit cancel action button on page load
  const cancelEditBtn = document.querySelector('.js-cancel-button');
  cancelEditBtn.style.display = 'none';

  // Add event listeners to buttons
  document.querySelector('.js-add-button').addEventListener('click', addTodo);
  document
    .querySelector('.js-cancel-button')
    .addEventListener('click', cancelEditTodo);

  // Add event listeners for sorting buttons
  document
    .querySelector('.sort-button-category')
    .addEventListener('click', () => sortTodos('category'));
  document
    .querySelector('.sort-button-priority')
    .addEventListener('click', () => sortTodos('priority'));

  // Add event listener for filter button
  document
    .querySelector('.js-filter-input')
    .addEventListener('change', filterTodos);
});

// Add year in the footer(CopyRight Notice)
let year = document.querySelector('.year');
year.innerText = new Date().getFullYear();