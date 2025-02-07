class UIManager {
  constructor(taskManager, taskList) {
    this.taskManager = taskManager;
    this.taskList = taskList;

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.querySelector('.js-add-button').addEventListener('click', () => {
      // for now... TaskManager just manages the list, but Task lists creates the task I guess
      // we need to create subclasses for TaskCreator and TaskEditor, if we are still doing that
      this.taskList.addTodo();
    });
    // Add event listeners to buttons
    document
      .querySelector('.js-cancel-button')
      .addEventListener('click', () => this.taskManager.cancelEditTodo());

    // Add event listeners for sorting buttons
    document
      .querySelector('.sort-button-category')
      .addEventListener('click', () => this.taskList.updateTodoList('category'));
    document
      .querySelector('.sort-button-priority')
      .addEventListener('click', () => this.taskList.updateTodoList('priority'));

    // Add event listener for filter button
    document
      .querySelector('.js-filter-input')
      .addEventListener('change', () => this.taskList.updateTodoList(''));

    document.querySelector('.js-name-input').addEventListener('input', (e) => {
      let input = e.target.value;
      if (input.length === 120) {
        alert('max character limits exceeded');
      }
    });

    // Piece of code that exists all on its own
    let dateCheck = false;
    let timeCheck = false;

    document.querySelector('.js-date-input').addEventListener('click', (e) => {
      e.preventDefault();
      if (!dateCheck) {
        e.target.showPicker();
        dateCheck = true;
      } else {
        dateCheck = false;
      }
    });

    document.querySelector('.js-date-input').addEventListener('blur', () => {
      dateCheck = false;
    });

    document.querySelector('.js-time-input').addEventListener('click', (e) => {
      e.preventDefault();
      if (!timeCheck) {
        e.target.showPicker();
        timeCheck = true;
      } else {
        timeCheck = false;
      }
    });

    document.querySelector('.js-time-input').addEventListener('blur', () => {
      timeCheck = false;
    });

  }

}

// I think we need another setup() that deals with setting up html
// Note: add this to app class as html setup
document.addEventListener('DOMContentLoaded', () => {

  // Set focus on the name input field
  const inputNameElement = document.querySelector('.js-name-input');
  inputNameElement.focus();

  // Hide edit cancel action button on page load
  const cancelEditBtn = document.querySelector('.js-cancel-button');
  cancelEditBtn.style.display = 'none';

  // I hope this is okay here, looks like the spot for it
  // Need to make sure this can be accessed in TaskList (addTodo) & TaskManager (cancelEditToDo)

  // Add icon - for add action
  const addIcon = document.createElement('i');
  addIcon.setAttribute('id', 'addIcon');  
  addIcon.classList.add('fa-solid', 'fa-add');
  // console.log("Test:" + addIcon);
  // console.log("HELLOO")

  // Check icon - for update action
  const checkIcon = document.createElement('i');
  checkIcon.setAttribute('id', 'checkIcon')
  checkIcon.classList.add('fa-solid', 'fa-check');


});

// Add year in the footer(CopyRight Notice)
let year = document.querySelector('.year');
year.innerText = new Date().getFullYear();

export default UIManager;