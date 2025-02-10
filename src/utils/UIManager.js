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
      this.taskList.addTask();
    });
    // Add event listeners to buttons
    document
      .querySelector('.js-cancel-button')
      .addEventListener('click', () => this.taskManager.cancelEditTask());

    // Add event listeners for sorting buttons
    document
      .querySelector('.sort-button-category')
      .addEventListener('click', () => this.taskList.updateTaskList('category'));
    document
      .querySelector('.sort-button-priority')
      .addEventListener('click', () => this.taskList.updateTaskList('priority'));

    // Add event listener for filter button
    // document
    //   .querySelector('.js-filter-input')
    //   .addEventListener('change', () => this.taskList.updateTaskList(''));

    document.querySelectorAll('.js-filter-input').forEach((button) => {
      button.addEventListener('change', () => this.taskList.updateTaskList(''));
    });

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
        
        //Setting date to today if time is clicked while date is empty
        const inputDateElement = document.querySelector('.js-date-input');
        if (!inputDateElement.value){
          const now = new Date();
          const date = now.toISOString().split('T')[0];console.log(inputDateElement.value);
          inputDateElement.value = date; 
        }

      } 
      else {
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
});

// Add year in the footer(CopyRight Notice)
let year = document.querySelector('.year');
year.innerText = new Date().getFullYear();

export default UIManager;
