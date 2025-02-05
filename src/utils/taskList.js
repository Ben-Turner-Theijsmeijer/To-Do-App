class TaskList {
  constructor() {
    this.tasks = [];
  }

  // ORIGINAL FUNCTIONS PORTED OVER
  updateTodoList() {
    // Sort todoList based on the current sort method
    let filteredTodos = todoList;

    // Apply filtering based on the selected filter method
    if (filterMethod === 'pending') {
      filteredTodos = todoList.filter((todo) => !todo.completed);
    } else if (filterMethod === 'completed') {
      filteredTodos = todoList.filter((todo) => todo.completed);
    }

    filteredTodos.sort((a, b) => {
      if (currentSortMethod === 'date') {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateA - dateB;
      } else if (currentSortMethod === 'category') {
        return currentCategorySortOrder === 'asc'
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      } else if (currentSortMethod === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return currentSortOrder === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      updateTaskCounter();
    });

    const addElement = document.querySelector('.js-add-html');
    todoListhtml = '';

    for (let i = 0; i < filteredTodos.length; i++) {
      const todo = filteredTodos[i];
      todoListhtml += `
        <div class="small-container ${todo.completed ? 'completed' : ''}">
          <input type="checkbox" class="js-complete-checkbox" data-index="${i}" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${todoList.indexOf(todo)})">
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
    if (todoList.length === 0) {
      addElement.style.display = 'none'; // Hide if no tasks
    } else {
      addElement.style.display = 'grid'; // Show if tasks exist
      addElement.innerHTML = todoListhtml;
    }

    console.log(window.innerWidth);

    // Add event listeners for delete and edit buttons
    document.querySelectorAll('.js-delete-button').forEach((button) => {
      button.addEventListener('click', (event) => {
        const index = event.currentTarget.getAttribute('data-index');
        deleteTodo(index);
      });
    });

    document.querySelectorAll('.js-edit-button').forEach((button) => {
      button.addEventListener('click', (event) => {
        const index = event.currentTarget.getAttribute('data-index');
        editTodo(index);
      });
    });

    // Call the task counter update function
    updateTaskCounter();
  }

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
  
    if (isEditing) {
      // Update the existing todo
      todoList[editIndex] = {
        name,
        date,
        time,
        category,
        priority,
        completed: false,
      }; // Ensure completed is set
      isEditing = false; // Reset edit mode
      editIndex = null;
  
      // Change the button back to 'Add'
      const addButton = document.querySelector('.js-add-button');
      addButton.innerHTML = '';
      addButton.title = 'Add';
      addButton.appendChild(addIcon);
  
      // Hide cancel button
      const cancelEditBtn = document.querySelector('.js-cancel-button');
      cancelEditBtn.style.display = 'none';
    } else {
      // Add a new todo
      todoList.push({ name, date, time, category, priority, completed: false }); // Ensure completed is set
    }
  
    // Save to localStorage
    localStorage.setItem('todoList', JSON.stringify(todoList));
  
    // Reset the inputs
    clearInputs();
  
    // Update the displayed list
    updateTodoList();
    updateTaskCounter();
  }

  deleteTodo(index) {
    // Remove the specific todo from the list
    todoList.splice(index, 1);
    localStorage.setItem('todoList', JSON.stringify(todoList));
    updateTodoList();
    updateTaskCounter();
  }

  updateTaskCounter() {
    const totalTasks = todoList.length;
  
    // Select the element where the task counter is displayed
    const taskCounterButton = document.querySelector('.task-counter-button');
  
    // Update the text of the task counter button
    if (taskCounterButton) {
      taskCounterButton.innerText = `Tasks: ${totalTasks}`;
    }
  }
}