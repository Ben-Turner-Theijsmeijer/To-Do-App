class FilterManager {
  constructor() {
    this.filterCompletion = 'all';
    this.filterCategory = 'all';
  }

  // Filters the to do list based on the selected filter method
  filterTasks(unfilteredTasks) {
    let filteredTasks = unfilteredTasks;
    
    const filterCompletionElement = document.querySelector('.filter-completion');
    this.filterCompletion = filterCompletionElement.value;
    if (this.filterCompletion === 'pending') {
      filteredTasks =  filteredTasks.filter(task => !task.completed);
    } else if (this.filterCompletion === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.completed);
    }
    
    const filterCategoryElement = document.querySelector('.filter-category');
    this.filterCategory = filterCategoryElement.value;
    if (this.filterCategory != 'all'){
      filteredTasks = filteredTasks.filter(task => this.filterCategory == task.category);
    }
    
    return filteredTasks;
  }
}

export default FilterManager;