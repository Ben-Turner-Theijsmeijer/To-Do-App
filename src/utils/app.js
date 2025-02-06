import TaskManager from './taskManager.js';
import TaskList from './taskList.js';
import FilterManager from './filterManager.js';
import SortManager from './sortManager.js';
import UIManager from './UIManager.js';

class App {
  constructor () {
    console.log("App.js script is running!");
    this.taskList = new TaskList();
    this.taskManager = new TaskManager(this.taskList);
    this.filterManager = new FilterManager(this.taskList);
    this.sortManager = new SortManager(this.taskList);
    this.uiManager = new UIManager(this.taskManager, this.filterManager, this.sortManager, this.taskList);
  }
  
  // should probably not add event listeners to selectors yet...
  // agreed to happen in UI Manager
}

// As soon as DOM loads, call App class
document.addEventListener("DOMContentLoaded", () => new App());
