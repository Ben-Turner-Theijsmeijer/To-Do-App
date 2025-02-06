class FilterManager {
  constructor(taskList) {
    this.taskList = taskList;
  }

  // ORIGINAL FUNCTIONS PORTED OVER
  filterTodos() {
    this.taskList.updateTodoList();
  }
}

export default FilterManager;