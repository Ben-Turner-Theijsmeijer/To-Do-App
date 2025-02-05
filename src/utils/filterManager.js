class FilterManager {
  constructor(taskList) {
    this.filteredToDo = taskList;
  }

  // ORIGINAL FUNCTIONS PORTED OVER
  filterTodos() {
    const filterElement = document.querySelector('.js-filter-input');
    filterMethod = filterElement.value;
    updateTodoList();
  }
}