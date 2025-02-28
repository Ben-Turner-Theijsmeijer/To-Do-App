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
    this.taskEditingIndex = null;

    this.sortManager = sortManager;
    this.filterManager = filterManager;
    
    this.updateTaskList('');

    // Ensure time input behavior is set on page load
    this.setupDateChangeListeners();
    
    //set up the csv upload option
    this.setupFileUploadListener();

    //set up the csv export option
    this.setupExportButtonListener();
  }

  /**
     * Sets up the file upload button to allow users to import tasks from a CSV file.
     * When the "Upload Tasks" button is clicked, it triggers a file input field.
     */
  setupFileUploadListener() {
    const uploadButton = document.getElementById("uploadTasksButton");
    const fileInput = document.getElementById("taskFileInput");

    if (uploadButton && fileInput) {
      // Open file dialog when the button is clicked
      uploadButton.addEventListener("click", () => fileInput.click());

      // Process the selected file
      fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
          this.importTasksFromCSV(file);
        }
      });
    }
  }

  /**
   * Sets up the export button to allow users to download their tasks as a CSV file.
   * When clicked, it calls the function to format and generate the CSV file.
   */
  setupExportButtonListener() {
    const exportButton = document.getElementById("exportTasksButton");

    if (exportButton) {
      exportButton.addEventListener("click", () => this.exportTasksToCSV());
    }
  }

  /**
   * Exports the current task list as a CSV file and prompts the user to download it.
   * - The CSV includes headers: TaskName, Date, Time, Category, Priority
   * - Dates are formatted as YYYY-MM-DD
   * - Time is in 24-hour format (if provided)
   * - Category and priority are converted to lowercase
   */
  exportTasksToCSV() {
    if (this.taskList.length === 0) {
      alert("No tasks to export.");
      return;
    }

    // CSV Header Row
    let csvContent = "TaskName,Date,Time,Category,Priority\n";

    // Loop through all tasks and format their data
    this.taskList.forEach((task) => {
      const taskName = task.name.trim(); // Task name is required
      const date = task.date ? task.date.trim() : ""; // Default to empty if missing
      const time = task.time ? task.time.trim() : ""; // Default to empty if missing
      const category = task.category ? task.category.trim().toLowerCase() : ""; // Lowercase
      const priority = task.priority ? task.priority.trim().toLowerCase() : ""; // Lowercase

      // Append the task to CSV content
      csvContent += `${taskName},${date},${time},${category},${priority}\n`;
    });

    // Create a downloadable CSV file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tasks.csv"; // Name of the exported file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Imports tasks from a CSV file uploaded by the user.
   * - Reads the file as text, splits it by lines
   * - Skips the first line if it contains the headers
   * - Extracts task properties: TaskName, Date, Time, Category, Priority
   * - Adds only tasks with a name (other fields can be blank)
   * - Saves tasks to localStorage and updates the UI
   *
   * @param {File} file - The CSV file selected by the user
   */
  importTasksFromCSV(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      let lines = text.split("\n").map((line) => line.trim()).filter(line => line);

      // Check if the first line contains the expected headers, and skip it
      if (lines[0].toLowerCase().startsWith("taskname,date,time,category,priority")) {
        lines.shift(); // Remove the first line (headers)
      }

      // Process each remaining line as a task
      lines.forEach((line) => {
        const [name, date, time, category, priority] = line.split(",").map(item => item.trim());

        if (name) { // Only add tasks with a name
          const newTask = new Task(
            name,
            date || "", // Default empty if missing
            time || "", // Default empty if missing
            category || "", // Default empty if missing
            priority || "", // Default empty if missing
            false // Task is not completed by default
          );

          this.taskList.push(newTask);
        }
      });

      // Save updated tasks and refresh UI
      localStorage.setItem("taskList", JSON.stringify(this.taskList));
      this.updateTaskList("");
      this.updateTaskCounter();
    };

    reader.readAsText(file); // Read the file as text
  }


  setupDateChangeListeners() {
    const inputDateElement = document.querySelector('.js-date-input');
    const inputTimeElement = document.querySelector('.js-time-input');

    if (inputDateElement && inputTimeElement) {
      // Initially disable the time input if no date is present
      inputTimeElement.disabled = !inputDateElement.value;
      inputTimeElement.classList.toggle('disabled', !inputDateElement.value);

      // Add event listener to enable time input when a date is entered
      inputDateElement.addEventListener('input', () => {
        inputTimeElement.disabled = !inputDateElement.value;
        inputTimeElement.classList.toggle('disabled', !inputDateElement.value);
      });
    }
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

    // Reapply date change listeners after updating the list
    this.setupDateChangeListeners();
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
        'Please enter a task name.'
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
    var date_text = task.time? task.date + ", " +  task.time : task.date; 

    if (task.getIsEditing()){
      console.log("hello")
      return `
      <div class="task" data-index="${referenceNumber}">
        <div class="task-info">
          <input type="text" class="js-edit-name" value="${task.name}"></input>
          <input type="date" class="js-edit-date" value="${task.date}"></input>
          <input type="time" class="js-edit-time" value="${task.time}"></input>
          <select class="js-edit-category">
          ${task.category ? `<option value"" selected disabled hidden>${task.category}</option>` : ``}
            <option value="">None</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
          <select class="js-edit-priority">
          ${task.priority ? `<option value"" selected disabled hidden>${task.priority}</option>` : ``}
            <option value="">None</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <button class="js-cancel-edit-button" data-index="${referenceNumber}">
          <i class="fa-solid fa-xmark"></i> Cancel
        </button>
        <button class="js-save-edit-button" data-index="${referenceNumber}">
        <i class="fa-solid fa-check"></i> Update
        </button>
        </div>`;
    }

    return `
      <div class="task" data-index="${referenceNumber}">
        <div class="small-container ${task.completed ? 'completed' : ''}">
          <input type="checkbox" class="js-complete-checkbox" data-index="${referenceNumber}" ${task.completed ? 'checked' : ''}>
          <div class="task-info">
            <span class="task-name">${task.name}</span>
            ${task.category ? `<span class="category-tag">${task.category}</span>` : ''}
            ${task.priority ? `<span class="priority-tag priority-${task.priority}">${task.priority}</span>` : ''}
            <div class="date-section">${date_text}</div>
          </div>
        </div>
        
        <button class="js-delete-button" data-index="${referenceNumber}">
        <i class="fa-solid fa-trash"></i>
        </button>
        <button class="js-edit-button" data-index="${referenceNumber}">
        <i class="fa-solid fa-pen"></i>
        </button>
        </div>`;
  }
      

  editTask(task){
    task.setIsEditing(true);
    this.updateTaskList("");
  }

  saveEditTask(task){
    let editNameElement = document.querySelector('.js-edit-name');
    let editDateElement = document.querySelector('.js-edit-date');
    let editTimeElement = document.querySelector('.js-edit-time');
    let editCategoryElement = document.querySelector('.js-edit-category');
    let editPriorityElement = document.querySelector('.js-edit-priority');

    let name = editNameElement.value;
    let date = editDateElement.value;
    let time = editTimeElement.value;
    let category = editCategoryElement.value;
    let priority = editPriorityElement.value;
    
    // console.log(editNameElement.value);

    task.updateTask({name, date, time, category, priority, completed: false});
    // console.log(task);
  }
      // <div class="small-container date-section">${date_text}</div>
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
        console.log(event);
        console.log(button);

        this.index = event.currentTarget.getAttribute('data-index');

        // If edit task is clicked while another task is being edited -> the previously edited task stops being edited.
        if (this.taskEditingIndex != null){
          tasksToDisplay[this.taskEditingIndex].setIsEditing(false);
          this.updateTaskList("");

        } 
        this.taskEditingIndex = this.index;

        this.editTask(tasksToDisplay[this.index]);
        // TaskManager.editTask(tasksToDisplay[this.index]);
      });
    });
    
    var cancelEditElement = document.querySelector('.js-cancel-edit-button');
    if (cancelEditElement){
      cancelEditElement.addEventListener('click', (event) => {

        this.index = event.currentTarget.getAttribute('data-index');
        // this.taskEditingIndex = null;

        tasksToDisplay[this.index].setIsEditing(false);
        this.updateTaskList("");
      });
    }

    var editElement = document.querySelector('.js-save-edit-button');
    if (editElement){
      editElement.addEventListener('click', (event) => {
        this.index = event.currentTarget.getAttribute('data-index');
        this.saveEditTask(tasksToDisplay[this.index]);
        // this.taskEditingIndex = null;

        tasksToDisplay[this.index].setIsEditing(false);
        this.updateTaskList("");
      });
    }

    document.querySelectorAll('.js-complete-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (event) => {
        this.index = event.target.dataset.index;  // Get the task index
        Task.toggleComplete(tasksToDisplay[this.index], this);  // Call the method from TaskList
      });
    });
  }
}

export default TaskList;
