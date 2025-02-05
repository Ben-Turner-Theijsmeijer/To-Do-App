const app = new App();
app.init();
export default app;

class App {

  static todoList = JSON.parse(localStorage.getItem('todoList')) || [];
  static uiManager = new UIManager(todoList);
  static todoListhtml = '';


  init() {
    console.log(todoList);

    let isEditing = false;
    let editIndex = null;

    let filterMethod = 'all';


    // Add icon - for add action
    const addIcon = document.createElement('i');
    addIcon.classList.add('fa-solid', 'fa-add');

    // Check icon - for update action
    const checkIcon = document.createElement('i');
    checkIcon.classList.add('fa-solid', 'fa-check');

    // Display the remaining characters count out of 120
    document.querySelector('.js-name-input').addEventListener('input', (e) => {
      let input = e.target.value;
      if (input.length === 120) {
        alert('max character limits exceeded');
      }
    });

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