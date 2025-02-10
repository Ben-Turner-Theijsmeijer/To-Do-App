import TaskManager from "./taskManager.js";
import Task from "./task.js";

class TaskList {
  constructor(sortManager, filterManager) {
    this.taskListData = JSON.parse(localStorage.getItem('taskList')) || [];
    
    this.taskList = []
    // Turning saved json into task objects
    this.taskListData.forEach( (savedTask) => {
      this.taskList.push(new Task(savedTask.name, savedTask.date, savedTask.time, savedTask.category, savedTask.priority, savedTask.completed))
    });

    this.taskListhtml = '';
    this.index = null;

    this.sortManager = sortManager;
    this.filterManager = filterManager;
    
    this.updateTaskList('');
  }

  updateTaskList(sortCriteria) {
    // filter and sort taskList based on the current criteria
    let filteredTasks = this.filterManager.filterTasks(this.taskList);
    let sortedTasks = this.sortManager.sortTasks(filteredTasks, sortCriteria);

    const addElement = document.querySelector('.js-add-html');
    this.taskListhtml = '';

    // generate all task HTML
    for (let i = 0; i < sortedTasks.length; i++) {
      const task = sortedTasks[i];
      this.taskListhtml += this.createTaskHTML(task, i);
    }

    // Show or hide the task container based on the presence of tasks
    if (sortedTasks.length === 0) {
      addElement.style.display = 'none'; // Hide if no tasks
    } else {
      addElement.style.display = 'grid'; // Show if tasks exist
      addElement.innerHTML = this.taskListhtml;
    }


    // add event listeners for new task list html elements
    this.addListeners(sortedTasks);

    // Call the task counter update function
    this.updateTaskCounter();
  }

  addTask() {
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
    if (!name) {
      alert(
        'Please fill in all fields: task, date, time, category, and priority.'
      );
      return;
    }

    // I don't really like this if... but I'm too tired to rewrite it 
    if (TaskManager.getIsEditing()) {
      var taskBeingEdited = TaskManager.getTaskBeingEdited();
      var foundTaskIndex = null;
      
      for (var i = 0; i < this.taskList.length; i++) {
        if (this.taskList[i].isEqual(taskBeingEdited) ){
          foundTaskIndex = i
        }
      }

      if (foundTaskIndex == null){
        console.log("error in editing task: no original task found");
      }
      // Update the existing task
      
      this.taskList[foundTaskIndex].updateTask({name, date, time, category, priority, completed: false}); 

      TaskManager.setIsEditing(false);
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
      // Add a new task
      const newTask = new Task(name, date, time, category, priority, false);
      this.taskList.push(newTask); 
      // this.taskList.push({ name, date, time, category, priority, completed: false });
    }

    // Save to localStorage
    localStorage.setItem('taskList', JSON.stringify(this.taskList));

    // Reset the inputs
    TaskManager.clearInputs();

    // Update the displayed list
    this.updateTaskList('');
    this.updateTaskCounter();
  }

  deleteTask(taskToDelete) {

    // Finding the task to remove and removing it from the main list
    for (var i = 0; i < this.taskList.length; i++) {
      if (this.taskList[i].isEqual(taskToDelete) ){
        this.taskList.splice(i, 1);
        localStorage.setItem('taskList', JSON.stringify(this.taskList));
        this.updateTaskList('');
        this.updateTaskCounter();
        return;
      }
    }

  }

  updateTaskCounter() {
    const totalTasks = this.taskList.length;

    // Select the element where the task counter is displayed
    const taskCounterButton = document.querySelector('.task-counter-button');

    // Update the text of the task counter button
    if (taskCounterButton) {
      taskCounterButton.innerText = `Tasks: ${totalTasks}`;
    }
  }

  // Create the HTML element to represent a task visually
  createTaskHTML(task, referenceNumber) {
    return `
        <div class="small-container ${task.completed ? 'completed' : ''}">
          <input type="checkbox" class="js-complete-checkbox" data-index="${referenceNumber}" ${task.completed ? 'checked' : ''}>
          <div class="task-info">
            <span class="task-name">${task.name}</span>
            <span class="category-tag">${task.category}</span>
            <span class="priority-tag priority-${task.priority}">${task.priority}</span>
          </div>
        </div>
        <div class="small-container">${task.date}</div>
        <div class="small-container">${task.time}</div>
        <button class="js-delete-button" data-index="${referenceNumber}">
        <i class="fa-solid fa-trash"></i>
        </button>
        <button class="js-edit-button" data-index="${referenceNumber}">
        <i class="fa-solid fa-pen"></i>
        </button>`;
  }

  // Add event listeners for delete, edit, and complete buttons
  addListeners(tasksToDisplay) {
    document.querySelectorAll('.js-delete-button').forEach((button) => {
      button.addEventListener('click', (event) => {
        this.index = event.currentTarget.getAttribute('data-index');
        this.deleteTask(tasksToDisplay[this.index]);
      });
    });

    document.querySelectorAll('.js-edit-button').forEach((button) => {
      button.addEventListener('click', (event) => {
        this.index = event.currentTarget.getAttribute('data-index');
        TaskManager.editTask(tasksToDisplay[this.index]);
      });
    });

    document.querySelectorAll('.js-complete-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (event) => {
        this.index = event.target.dataset.index;  // Get the task index
        Task.toggleComplete(tasksToDisplay[this.index], this);  // Call the method from TaskList
      });
    });
  }
}

export default TaskList;
