import TaskManager from "./taskManager.js";
// import {clearInputs} from "./taskManager.js";

// This class contains updateTodoList... which is an absolute mess... need to fix this
class TaskList {
  constructor() {
    this.todoList = JSON.parse(localStorage.getItem('todoList')) || [];
    this.todoListhtml = '';
    this.filterMethod = 'all';
    this.index = null;

    // NOTE: Remove these once updateTodoList gets fixed, should be in Sort
    this.currentSortMethod = 'date';
    this.currentSortOrder = 'asc';
    this.currentCategorySortOrder = 'asc';

    this.updateTodoList();
  }

  // ORIGINAL FUNCTIONS PORTED OVER
  updateTodoList() {
    const filterElement = document.querySelector('.js-filter-input');
    this.filterMethod = filterElement.value;

    // Sort todoList based on the current sort method
    let filteredTodos = this.todoList;

    // Apply filtering based on the selected filter method
    if (this.filterMethod === 'pending') {
      filteredTodos = filteredTodos.filter((todo) => !todo.completed);
    } else if (this.filterMethod === 'completed') {
      filteredTodos = filteredTodos.filter((todo) => todo.completed);
    }

    filteredTodos.sort((a, b) => {
      if (this.currentSortMethod === 'date') {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateA - dateB;
      } else if (this.currentSortMethod === 'category') {
        return this.currentCategorySortOrder === 'asc'
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      } else if (this.currentSortMethod === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return this.currentSortOrder === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      this.updateTaskCounter();
    });

    const addElement = document.querySelector('.js-add-html');
    this.todoListhtml = ''; //probably not needed

    for (let i = 0; i < filteredTodos.length; i++) {
      const todo = filteredTodos[i];
      this.todoListhtml += `
        <div class="small-container ${todo.completed ? 'completed' : ''}">
          <input type="checkbox" class="js-complete-checkbox" data-index="${i}" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${this.todoList.indexOf(todo)})">
          <div class="task-info">
            <span class="task-name">${todo.name}</span>
            <span class="category-tag">${todo.category}</span>
            <span class="priority-tag priority-${todo.priority}">${todo.priority}</span>
          </div>
        </div>
        <div class="small-container">${todo.date}</div>
        <div class="small-container">${todo.time}</div>
        <button class="js-delete-button" data-index="${i}">
        <i class="fa-solid fa-trash"></i>
        </button>
        <button class="js-edit-button" data-index="${i}">
        <i class="fa-solid fa-pen"></i>
        </button>`;
    }

    // Show or hide the task container based on the presence of tasks
    if (filteredTodos.length === 0) {
      addElement.style.display = 'none'; // Hide if no tasks
    } else {
      addElement.style.display = 'grid'; // Show if tasks exist
      addElement.innerHTML = this.todoListhtml;
    }

    console.log(window.innerWidth);

    // Add event listeners for delete and edit buttons
    document.querySelectorAll('.js-delete-button').forEach((button) => {
      button.addEventListener('click', (event) => {
        this.index = event.currentTarget.getAttribute('data-index');
        this.deleteTodo(this.index);
      });
    });

    document.querySelectorAll('.js-edit-button').forEach((button) => {
      button.addEventListener('click', (event) => {
        this.index = event.currentTarget.getAttribute('data-index');
        TaskManager.editTodo(this.todoList[this.index]); //idk if this will work
      });
    });

    // Call the task counter update function
    this.updateTaskCounter();
  }

  // Do we even need task if we are just getting straight from the DOM? Need to reorganize this
  addTodo() {
    const inputNameElement = document.querySelector('.js-name-input');
    const inputDateElement = document.querySelector('.js-date-input');
    const inputTimeElement = document.querySelector('.js-time-input');
    const inputCategoryElement = document.querySelector('.js-category-input');
    const inputPriorityElement = document.querySelector('.js-priority-input');

    let name = inputNameElement.value;
    let date = inputDateElement.value;
    let time = inputTimeElement.value;
    let category = inputCategoryElement.value;
    let priority = inputPriorityElement.value;

    // Validation checks
    if (!name || !date || !time || !category || !priority) {
      alert(
        'Please fill in all fields: task, date, time, category, and priority.'
      );
      return;
    }

    // Check that date is not in past
    if (date < inputDateElement.min) {
      alert('Please select the current date or a future date.');
      return;
    }

    // Check that time is not in past
    if (time < inputTimeElement.min && date === inputDateElement.min) {
      alert('Please select a future time.');
      return;
    }

    if (TaskManager.getIsEditing()) {
      // Update the existing todo
      this.todoList[this.index] = {
        name,
        date,
        time,
        category,
        priority,
        completed: false,
      }; // Ensure completed is set
      TaskManager.setIsEditing();
      this.index = null;

      // Change the button back to 'Add'
      const addButton = document.querySelector('.js-add-button');
      addButton.innerHTML = ' Add Task';
      addButton.title = 'Add';

      // add plus icon
      const addIcon = document.createElement('span');
      addIcon.classList.add('fa-solid', 'fa-add');
      addButton.prepend(addIcon);

      // Hide cancel button
      const cancelEditBtn = document.querySelector('.js-cancel-button');
      cancelEditBtn.style.display = 'none';
    } else {
      // Add a new todo
      this.todoList.push({ name, date, time, category, priority, completed: false }); // Ensure completed is set
    }

    // Save to localStorage
    localStorage.setItem('todoList', JSON.stringify(this.todoList));

    // Reset the inputs
    // FIX ME
    TaskManager.clearInputs();

    // Update the displayed list
    this.updateTodoList();
    this.updateTaskCounter();
  }

  deleteTodo(index) {
    // Remove the specific todo from the list
    this.todoList.splice(index, 1);
    localStorage.setItem('todoList', JSON.stringify(this.todoList));
    this.updateTodoList();
    this.updateTaskCounter();
  }

  updateTaskCounter() {
    const totalTasks = this.todoList.length;

    // Select the element where the task counter is displayed
    const taskCounterButton = document.querySelector('.task-counter-button');

    // Update the text of the task counter button
    if (taskCounterButton) {
      taskCounterButton.innerText = `Tasks: ${totalTasks}`;
    }
  }
}

export default TaskList;
