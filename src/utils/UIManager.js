class UIManager {
  constructor(taskList) {
    this.taskList = taskList;

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.querySelector('.js-add-button').addEventListener('click', () => {
      // we need to create subclasses for TaskCreator and TaskEditor, if we are still doing that
      this.taskList.addTask();
    });

    // Add event listeners for sorting buttons
    document.querySelector('.sort-button-category').addEventListener('click', () => {
      //Quit editing task if sort is clicked
      this.taskList.setEditingTaskIndex(null);

      this.taskList.updateTaskList('category')
    });

    document.querySelector('.sort-button-priority').addEventListener('click', () => {
      //Quit editing task if sort is clicked
      this.taskList.setEditingTaskIndex(null);

      this.taskList.updateTaskList('priority')
    });

    document.querySelectorAll('.js-filter-input').forEach((button) => {
      
      button.addEventListener('change', () => {
        //Quit editing task if filter is changed
        this.taskList.setEditingTaskIndex(null);

        this.taskList.updateTaskList('')
      });

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


});

// Add year in the footer(CopyRight Notice)
let year = document.querySelector('.year');
year.innerText = new Date().getFullYear();

export default UIManager;
