class FilterManager {
  constructor(taskList) {
    this.taskList = taskList;
  }

  // ORIGINAL FUNCTIONS PORTED OVER
  filterTodos() {
    const filterElement = document.querySelector('.js-filter-input');
    filterMethod = filterElement.value;
    this.taskList.updateTodoList();
  }
}

export default FilterManager;