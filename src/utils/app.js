import TaskManager from './taskManager.js';
import TaskList from './taskList.js';
import FilterManager from './filterManager.js';
import SortManager from './sortManager.js';
import UIManager from './UIManager.js';

class App {
  constructor () {

    this.sortManager = new SortManager();
    this.filterManager = new FilterManager();
    this.taskList = new TaskList(this.sortManager, this.filterManager);
    this.taskManager = new TaskManager(this.taskList);
    this.uiManager = new UIManager(this.taskManager, this.taskList);
  }
  
}

// As soon as DOM loads, call App class
document.addEventListener("DOMContentLoaded", () => new App());
