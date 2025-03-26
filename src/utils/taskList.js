import Task from "./task.js";
import UIManager from "./UIManager.js";

class TaskList {
  constructor(sortManager, filterManager) {
    this.taskListData = JSON.parse(localStorage.getItem('taskList')) || [];
    
    this.taskList = [];
    // Turning saved json into task objects
    this.taskListData.forEach( (savedTask) => {
      this.taskList.push(new Task(savedTask.name, savedTask.date, savedTask.time, savedTask.category, savedTask.priority, savedTask.completed, savedTask.recurring, savedTask.description))
    });

    this.taskListhtml = '';
    this.index = null;
    this.taskEditingIndex = null;
    this.taskDraggingIndex = null;
    this.sortManager = sortManager;
    this.filterManager = filterManager;
    
    this.updateAndDisplayTaskList();

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
   * - The CSV includes headers: TaskName, Date, Time, Category, Priority, Recurring, Description
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
    let csvContent = "TaskName,Date,Time,Category,Priority,Recurring,Description\n";

    // Loop through all tasks and format their data
    this.taskList.forEach((task) => {
      const taskName = task.name.trim(); // Task name is required
      const date = task.date ? task.date.trim() : ""; // Default to empty if missing
      const time = task.time ? task.time.trim() : ""; // Default to empty if missing
      const category = task.category ? task.category.trim() : ""; 
      const priority = task.priority ? task.priority.trim() : ""; 
      const recurring = task.recurring ? task.recurring : ""; 
      const description = task.description ? task.description : "";

      // Append the task to CSV content
      csvContent += `${taskName},${date},${time},${category},${priority},${recurring},${description}\n`;
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
      if (lines[0].toLowerCase().startsWith("taskname,date,time,category,priority,description")) {
        lines.shift(); // Remove the first line (headers)
      }

      // Process each remaining line as a task
      lines.forEach((line) => {
        const [name, date, time, category, priority, recurring, description] = line.split(",").map(item => item.trim());

        if (name) { // Only add tasks with a name
          const newTask = new Task(
            name,
            date || "", // Default empty if missing
            time || "", // Default empty if missing
            category || "", // Default empty if missing
            priority || "", // Default empty if missing
            false, // Task is not completed by default
            recurring || "",
            description || ""
          );

          this.taskList.push(newTask);
        }
      });

      // Save updated tasks and refresh UI
      this.updateAndDisplayTaskList();
    };

    reader.readAsText(file); // Read the file as text
  }


  setupDateChangeListeners() {
    const inputDateElement = document.querySelector('.js-date-input');
    const inputTimeElement = document.querySelector('.js-time-input');
    const inputRecurringElement = document.querySelector('.js-recurring-input');
    
    if (inputDateElement && inputTimeElement && inputRecurringElement) {
      // Initially disable the all inputs if no date is present
      inputTimeElement.disabled = !inputDateElement.value;
      inputTimeElement.classList.toggle('disabled', !inputDateElement.value);

      inputRecurringElement.disabled = !inputDateElement.value;
      inputRecurringElement.classList.toggle('disabled', !inputDateElement.value);

      // Add event listener to enable all input when a date is entered
      inputDateElement.addEventListener('input', () => {

        inputTimeElement.disabled = !inputDateElement.value;
        inputTimeElement.classList.toggle('disabled', !inputDateElement.value);

        inputRecurringElement.disabled = !inputDateElement.value;
        inputRecurringElement.classList.toggle('disabled', !inputDateElement.value);

        // reset date dependant varibles when date gets cleared
        if (!inputDateElement.value) {
          inputTimeElement.value = '';
          inputRecurringElement.value = '';
          document.getElementById("add-date-warn").style.visibility = "hidden";
          document.getElementById("add-time-warn").style.visibility = "hidden";
        }
      });
    }
  }

  sortTaskList(sortCriteria){
    let sortedTasks = this.sortManager.sortTasks(this.taskList, sortCriteria);
    this.taskList = sortedTasks;
    return this.taskList;
  }

  updateAndDisplayTaskList() {
    // filter and sort taskList based on the current criteria
    let filteredTasks = this.filterManager.filterTasks(this.taskList);
    // let sortedTasks = this.sortManager.sortTasks(filteredTasks, sortCriteria);

    const addElement = document.querySelector('.js-add-html');
    this.taskListhtml = '';

    // generate all task HTML
    for (let i = 0; i < filteredTasks.length; i++) {
      const task = filteredTasks[i];
      this.taskListhtml += this.createTaskHTML(task, i);
    }

    // Show or hide the task container based on the presence of tasks
    if (filteredTasks.length === 0) {
      addElement.style.display = 'none'; // Hide if no tasks
    } else {
      addElement.style.display = 'grid'; // Show if tasks exist
      addElement.innerHTML = this.taskListhtml;
    }

    // add event listeners for new task list html elements
    this.addListeners(filteredTasks);

    // Call the task counter update function
    this.updateTaskCounter();

    // Reapply date change listeners after updating the list
    this.setupDateChangeListeners();

    //Saving updated tasklist to localStorage
    localStorage.setItem('taskList', JSON.stringify(this.taskList));
  }

  addTask() {
    const inputNameElement = document.querySelector('.js-name-input');
    const inputDateElement = document.querySelector('.js-date-input');
    const inputTimeElement = document.querySelector('.js-time-input');
    const inputCategoryElement = document.querySelector('.js-category-input');
    const inputPriorityElement = document.querySelector('.js-priority-input');
    const inputRecurringElement = document.querySelector('.js-recurring-input');
    const inputDescElement = document.querySelector('.js-desc-input');

    let name = inputNameElement.value;
    let date = inputDateElement.value;
    let time = inputTimeElement.value;
    let category = inputCategoryElement.value;
    let priority = inputPriorityElement.value;
    let recurring = inputRecurringElement.value;
    let description = inputDescElement.value;

    // Validation checks
    if (!name) {
      alert(
        'Please enter a task name.'
      );
      return;
    }

    // Add a new task
    const newTask = new Task(name, date, time, category, priority, false, recurring, description);
    this.taskList.push(newTask);     

    // Reset the inputs
    inputNameElement.value = '';
    inputDateElement.value = '';
    inputTimeElement.value = '';
    inputCategoryElement.value = '';
    inputPriorityElement.value = '';
    inputRecurringElement.value = '';
    inputDescElement.value = '';

    document.getElementById("add-date-warn").style.visibility = "hidden";
    document.getElementById("add-time-warn").style.visibility = "hidden";

    // reset textarea size
    if (inputDescElement.value.trim() === "") {
      inputDescElement.style.height = "3rem";
   }

    // Update the displayed list
    this.updateAndDisplayTaskList();
  }

  deleteTask(taskToDelete) {

    // Finding the task to remove and removing it from the main list
    for (var i = 0; i < this.taskList.length; i++) {
      if (this.taskList[i].isEqual(taskToDelete) ){
        this.taskList.splice(i, 1);
        this.updateAndDisplayTaskList();
        return;
      }
    }

  }

  updateTaskCounter() {
    const totalTasks = this.taskList.length;

    // Select the element where the task counter is displayed
    const taskCounterButton = document.querySelector('.task-counter');

    // Update the text of the task counter button
    if (taskCounterButton) {
      taskCounterButton.innerText = `Total tasks: ${totalTasks}`;
    }
  }

  // Create the HTML element to represent a task visually
  createTaskHTML(task, referenceNumber) {

    task.updateTimeString();

    //Can only drag & drop if no tasks are begin edited
    var draggableText = this.taskEditingIndex == null ? 'draggable="true"' : '';

    // Set task UI to editing if index is being edited
    if (referenceNumber == this.taskEditingIndex){
      console.log("Editing" + referenceNumber)
      return `
      <div class="task task-edit" data-index="${referenceNumber}">

        <div class="task-edit-fields">
          <input type="text" class="js-edit-name" value="${task.name}" maxlength="120"></input>
          <select class="js-edit-category">
          ${task.category ? `<option value="${task.category}" selected disabled hidden>${task.category}</option>` : `<option value="" selected disabled hidden>Category</option>`}
            <option value="">None</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
          <select class="js-edit-priority">
          ${task.priority ? `<option value="${task.priority}" selected disabled hidden>${task.priority}</option>` : `<option value="" selected disabled hidden>Priority</option>`}
            <option value="">None</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <div class="break"></div>
          <input type="date" class="js-edit-date" value="${task.date}"></input>
          <input type="time" class="js-edit-time" style="width: 125px" value="${task.time}"></input>
          <select class="js-edit-recurring">
          ${task.recurring ? `<option value="${task.recurring}" selected disabled hidden>${task.recurring}</option>` : `<option value="" selected disabled hidden>Recurring</option>`}
            <option value="">None</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
          <span style="width:100%;"></span>
          <span id="edit-date-warn">Warning: Past date!</span>
          <span id="edit-time-warn">Warning: Past time!</span>
        </div>
        
        <div class="task-edit-buttons">
          <button class="js-cancel-edit-button" data-index="${referenceNumber}">
            <i class="fa-solid fa-xmark"></i> Cancel
          </button>
          <button class="js-save-edit-button" data-index="${referenceNumber}">
          <i class="fa-solid fa-check"></i> Update
          </button>
        </div>

      </div>`;
    }

    // This was added to fix a hover-over issue with the big date field
    let missingTag = !task.recurring || !task.category || !task.priority;

    console.log('task desc:' + task.description);

    return `
      <div class="task" ${draggableText} data-index="${referenceNumber}">
        
        <div class="small-container ${task.completed ? 'completed' : ''}">
          <input type="checkbox" class="js-complete-checkbox" data-index="${referenceNumber}" ${task.completed ? 'checked' : ''}>
          <div class="task-info">
            <span class="task-name">${task.name}</span>
            ${task.recurring ? `<span class="recurring-tag">${task.recurring}</span>` : ''}
            ${task.category ? `<span class="category-tag">${task.category}</span>` : ''}
            ${task.priority ? `<span class="priority-tag priority-${task.priority}">${task.priority}</span>` : ''}
            <span style= "width: 100%;"></span>
            <div class="date-section ${task.isOverdue()} 
            ${task.isOverdue() == 'overdue' ? 'overdue-tooltip' :''}
            ${task.isOverdue() == 'due' ? 'due-tooltip' : ''}">
              ${task.isOverdue() == 'overdue' ? `<span>⚠️</span>` : ''}
              ${task.isOverdue() == 'due' ? `<span>🕓</span>` : ''}
              <span>${task.dateText}</span>
            </div>
          </div>
        </div>
        ${task.description ? 
          `<span class="js-desc-toggle" data-index="${referenceNumber}" tabindex="0">
          <i class="fa-solid fa-chevron-right fa-2xs"></i>
          <i class="fa-solid fa-info-circle"></i>
        </span>` : '<span></span>'}
        <button class="js-delete-button" data-index="${referenceNumber}">
        <i class="fa-solid fa-trash"></i>
        </button>
        <button class="js-edit-button" data-index="${referenceNumber}">
        <i class="fa-solid fa-pen"></i>
        </button>
        ${task.description ?
        `<span class="description-box hidden" data-index="${referenceNumber}">${task.description}</span>` : ''}
      </div>`;

  }

  setEditingTaskIndex(index){
    this.taskEditingIndex = index;
  }

  saveEditTask(task){
    let editNameElement = document.querySelector('.js-edit-name');
    let editDateElement = document.querySelector('.js-edit-date');
    let editTimeElement = document.querySelector('.js-edit-time');
    let editCategoryElement = document.querySelector('.js-edit-category');
    let editPriorityElement = document.querySelector('.js-edit-priority');
    let editRecurringElement = document.querySelector('.js-edit-recurring');

    let name = editNameElement.value;
    let date = editDateElement.value;
    let time = editTimeElement.value;
    let category = editCategoryElement.value;
    let priority = editPriorityElement.value;
    let complete = task.completed;
    let recurring = editRecurringElement.value;

    // check that a date is set before allowing a time and recurring status to be set
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(editDateElement.value)) {
      time = '';
      recurring = '';
    }

    task.updateTask(name, date, time, category, priority, complete, recurring);
  }

  moveTaskInTasklist(startIndex, destinationIndex){
    
    //Removing item from list
    var taskToMove = this.taskList.splice(startIndex, 1)[0];

    //Adding back item in new location
    this.taskList.splice(destinationIndex, 0, taskToMove);

  }

  // Add event listeners for dynamic page elements
  addListeners(tasksToDisplay) {
    
    /******** Task button listeners ********/
    document.querySelectorAll('.js-desc-toggle').forEach((span) =>{
      span.addEventListener('click', (event) => {
        this.index = event.currentTarget.getAttribute('data-index');
        const descBox = document.querySelector(`.description-box[data-index="${this.index}"]`);

        descBox.classList.toggle("hidden");
        
        // handles rotation of chevron when clicked
        const chevron = document.querySelector(".fa-chevron-right");
        if (chevron) {
          chevron.classList.toggle("fa-rotate-90");
        }

      });
    });

    document.querySelectorAll('.js-delete-button').forEach((button) => {
      button.addEventListener('click', (event) => {
        this.index = event.currentTarget.getAttribute('data-index');
        this.deleteTask(tasksToDisplay[this.index]);
      });
    });
    
    document.querySelectorAll('.js-edit-button').forEach((button) => {
      button.addEventListener('click', (event) => {
        this.index = event.currentTarget.getAttribute('data-index');
        this.taskEditingIndex = this.index;
        this.updateAndDisplayTaskList();

        //Bringing cursor to end of title
        var editName = document.querySelector('.js-edit-name');
        editName.focus();
        var name = editName.value; 
        editName.value = '';
        editName.value = name;

        // disable editing of time and recurring if no selected date
        let dateEditElement = document.querySelector('.js-edit-date');
        let timeEditElement = document.querySelector('.js-edit-time');
        let recurringEditElement = document.querySelector('.js-edit-recurring');

        if (!dateEditElement.value) {
          timeEditElement.disabled = !dateEditElement.value;
          timeEditElement.classList.toggle('disabled', !dateEditElement.value);
    
          recurringEditElement.disabled = !dateEditElement.value;
          recurringEditElement.classList.toggle('disabled', !dateEditElement.value);
        }
      });
    });

    document.querySelectorAll('.js-complete-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (event) => {
        this.index = event.target.dataset.index;  // Get the task index
        Task.toggleComplete(tasksToDisplay[this.index], this);  // Call the method from TaskList
        localStorage.setItem('taskList', JSON.stringify(this.taskList));
      });
    });

    /******** Task editing listeners ********/
    var cancelEditElement = document.querySelector('.js-cancel-edit-button');
    if (cancelEditElement){
      cancelEditElement.addEventListener('click', (event) => {
        this.index = event.currentTarget.getAttribute('data-index');
        this.taskEditingIndex = null;
        this.updateAndDisplayTaskList();
      });
    }

    var saveEditElement = document.querySelector('.js-save-edit-button');
    if (saveEditElement){
      saveEditElement.addEventListener('click', (event) => {
        this.index = event.currentTarget.getAttribute('data-index');
        this.saveEditTask(tasksToDisplay[this.index]);
        this.taskEditingIndex = null;
        this.updateAndDisplayTaskList();
      });
    }

    /******* Date and Time Event Listeners *******/
    var dateEditElement = document.querySelector('.js-edit-date');
    if (dateEditElement){
      dateEditElement.addEventListener('change', (event) => {
        UIManager.datePastCheck(event.target.value, "edit-date-warn");
        UIManager.timePastCheck(document.querySelector(".js-edit-time")?.value, "edit-time-warn");
      
      });
    }

    var timeEditElement = document.querySelector('.js-edit-time');
    if (timeEditElement){
      timeEditElement.addEventListener('change', (event) => {
        UIManager.datePastCheck(document.querySelector(".js-edit-date")?.value, "edit-date-warn");
        UIManager.timePastCheck(event.target.value, "edit-time-warn");
      
      });
    }

    // remove and disable time and recurring status fields on date clear
    var recurringEditElement = document.querySelector('.js-edit-recurring');
    if (dateEditElement){
      dateEditElement.addEventListener('input', () => {
        timeEditElement.disabled = !dateEditElement.value;
        timeEditElement.classList.toggle('disabled', !dateEditElement.value);

        recurringEditElement.disabled = !dateEditElement.value;
        recurringEditElement.classList.toggle('disabled', !dateEditElement.value);

        if (!dateEditElement.value) {
          timeEditElement.value = '';
          recurringEditElement.value = '';
          document.getElementById("edit-date-warn").style.visibility = "hidden";
          document.getElementById("edit-time-warn").style.visibility = "hidden";
        }

      });
    }

    /******** Task drag and drop listeners ********/
    document.querySelectorAll('.task').forEach((task) => {
      
      task.addEventListener('dragstart', (event) => {
        task.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";


        //Saving index of task being dragged
        this.taskDraggingIndex = event.target.getAttribute('data-index');
      });

      task.addEventListener('dragover', (event) => {
        event.preventDefault();
        
        //Return if dragging over itself
        var dragOverIndex = task.getAttribute("data-index");
        if (dragOverIndex == this.taskDraggingIndex){
          return;
        }
        
        //Finding the indexes in the actual list by checking equality for each task in displayed list (accounting for filters)
        var draggedIndexInFullList = this.taskList.map( t => t.isEqual(tasksToDisplay[this.taskDraggingIndex]) ).indexOf(true) ;
        var dragOverIndexInFullList = this.taskList.map( t => t.isEqual(tasksToDisplay[dragOverIndex]) ).indexOf(true) ;

        //Moving task to new location and displaying updated list order
        this.moveTaskInTasklist(draggedIndexInFullList, dragOverIndexInFullList);
        this.updateAndDisplayTaskList();

        //Set dragging task index to new index now that it has been moved
        this.taskDraggingIndex = dragOverIndex;

        //Adding back dragging class to dragging task for styling
        document.querySelectorAll(".task").forEach((taskBeingDisplayed) => {
          taskBeingDisplayed.classList.add("no-hover");
          if (taskBeingDisplayed.getAttribute("data-index") == this.taskDraggingIndex){
            taskBeingDisplayed.classList.add("dragging");
          }
        });

      });

      task.addEventListener('dragend', (event) => {
        console.log("dragEND");

        //Removing dragging styling from tasks
        document.querySelectorAll(".task").forEach((taskBeingDisplayed) => {
          taskBeingDisplayed.classList.remove("dragging");
          taskBeingDisplayed.classList.remove("no-hover");
        });

        //No task is being dragged
        this.taskDraggingIndex = null;
      });

    });

    //Removing finicky default animation when task is dropped
    var tasksContainer = document.body;
    document.body.addEventListener('dragover', (event) => {
      event.preventDefault();
    });


  }


}

export default TaskList;
