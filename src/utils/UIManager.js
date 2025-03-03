class UIManager {
  constructor(taskList) {
    this.taskList = taskList;

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.querySelector(".js-add-button").addEventListener("click", () => {
      this.taskList.addTask();
    });

    // Add event listeners for sorting buttons
    document.querySelector('#sort-button-category').addEventListener('click', () => {
      //Quit editing task if sort is clicked
      this.taskList.setEditingTaskIndex(null);
      this.taskList.sortTaskList("category");
      this.taskList.updateAndDisplayTaskList() //sort
    });

    document.querySelector('#sort-button-priority').addEventListener('click', () => {
      //Quit editing task if sort is clicked
      this.taskList.setEditingTaskIndex(null);
      this.taskList.sortTaskList("priority");
      this.taskList.updateAndDisplayTaskList() //sort
    });
    
    document.querySelector("#sort-button-date").addEventListener("click", () => {
      //Quit editing task if sort is clicked
      this.taskList.setEditingTaskIndex(null);
      this.taskList.sortTaskList("date");
      this.taskList.updateAndDisplayTaskList(); //sort
    });

    document.querySelectorAll('.js-filter-input').forEach((button) => {
      
      button.addEventListener('change', () => {
        //Quit editing task if filter is changed
        this.taskList.setEditingTaskIndex(null);

        this.taskList.updateAndDisplayTaskList()
      });

    });

    // Piece of code that exists all on its own
    let dateCheck = false;
    let timeCheck = false;

    document.querySelector(".js-date-input").addEventListener("click", e => {
      e.preventDefault();
      if (!dateCheck) {
        e.target.showPicker();
        dateCheck = true;
      } else {
        dateCheck = false;
      }
    });

    document.querySelector(".js-date-input").addEventListener("blur", () => {
      dateCheck = false;
    });

    document.querySelector(".js-time-input").addEventListener("click", e => {
      e.preventDefault();
      if (!timeCheck) {
        e.target.showPicker();
        timeCheck = true;

        //Setting date to today if time is clicked while date is empty
        const inputDateElement = document.querySelector(".js-date-input");
        if (!inputDateElement.value) {
          const now = new Date();
          const date = now.toISOString().split("T")[0];
          console.log(inputDateElement.value);
          inputDateElement.value = date;
        }
      } else {
        timeCheck = false;
      }
    });

    document.querySelector(".js-time-input").addEventListener("blur", () => {
      timeCheck = false;
    });

    // add function to open Filter Menu
    document.querySelector("#open-filters-btn").addEventListener("click", () => {
        var btn = document.getElementById("open-filters-btn");
        var x = document.getElementById("filter-menu");
        if (x.style.display === "none") {
          x.style.display = "block";
          btn.innerHTML = "Close Filters";
        } else {
          x.style.display = "none";
          btn.innerHTML = "Open Filters";
        }
      });

    // add function to filter reset button
    document.querySelector("#reset-filters").addEventListener("click", () => {
      var select = document.querySelector(".filter-completion");
      select.selectedIndex = 0;
      select = document.querySelector(".filter-category");
      select.selectedIndex = 0;
      select = document.querySelector(".filter-priority");
      select.selectedIndex = 0;
      this.taskList.updateAndDisplayTaskList();
    });

    // add function to search bar
    var searchBar = document.querySelector("#search");
    searchBar.addEventListener("input", e => {
      const searchTerm = searchBar.value.toLowerCase();
      this.taskList.filterManager.setSearchFilter(searchTerm);
      this.taskList.updateAndDisplayTaskList();
    });

    // add function to 24 hour format toggle
    document.querySelector("#switch24Hour").addEventListener("change", () => { 
      localStorage.setItem('timeFormat24Hr', document.querySelector("#switch24Hour").checked);   
      this.taskList.updateAndDisplayTaskList();  
    });
  }
}

// I think we need another setup() that deals with setting up html
// Note: add this to app class as html setup
document.addEventListener("DOMContentLoaded", () => {
  // Set focus on the name input field
  const inputNameElement = document.querySelector(".js-name-input");
  inputNameElement.focus();
  const switch24Hour = document.querySelector("#switch24Hour");
  const savedTimeFormat = localStorage.getItem('timeFormat24Hr');
  if (savedTimeFormat !== null) {
    console.log("time format 24 hours = " + savedTimeFormat)
    switch24Hour.checked = (savedTimeFormat === 'true');
  }
});


// Add year in the footer(CopyRight Notice)
let year = document.querySelector(".year");
year.innerText = new Date().getFullYear();

export default UIManager;
