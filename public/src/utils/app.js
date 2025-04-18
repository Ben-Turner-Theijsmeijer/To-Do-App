import TaskList from './taskList.js';
import FilterManager from './filterManager.js';
import SortManager from './sortManager.js';
import UIManager from './UIManager.js';

class App {
  constructor () {
    this.sortManager = new SortManager();
    this.filterManager = new FilterManager();
    this.taskList = new TaskList(this.sortManager, this.filterManager);
    this.uiManager = new UIManager(this.taskList);
  }
  
}

// As soon as DOM loads, call App class
document.addEventListener("DOMContentLoaded", () => new App());



