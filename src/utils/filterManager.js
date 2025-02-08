class FilterManager {
  constructor() {
    this.filterMethod = 'all';
  }

  // Filters the to do list based on the selected filter method
  filterTasks(unfilteredTasks) {
    let filteredTasks = unfilteredTasks;
    const filterElement = document.querySelector('.js-filter-input');
    this.filterMethod = filterElement.value;
    
    if (this.filterMethod === 'pending') {
      return filteredTasks.filter(task => !task.completed);
    } else if (this.filterMethod === 'completed') {
      return filteredTasks.filter(task => task.completed);
    }
    return filteredTasks;
  }
}

export default FilterManager;