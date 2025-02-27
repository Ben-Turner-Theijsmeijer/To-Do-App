class FilterManager {
  constructor() {
    this.filterCompletion = 'all';
    this.filterCategory = 'all';
    this.filterPriority = 'all';
  }

  // Filters the to do list based on the selected filter method
  filterTasks(unfilteredTasks) {
    let filteredTasks = unfilteredTasks;
    
    //Filtering for completion
    const filterCompletionElement = document.querySelector('.filter-completion');
    this.filterCompletion = filterCompletionElement.value;
    if (this.filterCompletion === 'pending') {
      filteredTasks =  filteredTasks.filter(task => !task.completed);
    } else if (this.filterCompletion === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.completed);
    }
    
    //Filtering for Category
    const filterCategoryElement = document.querySelector('.filter-category');
    this.filterCategory = filterCategoryElement.value;
    if (this.filterCategory != 'All' && this.filterCategory != 'all'){
      filteredTasks = filteredTasks.filter(task => this.filterCategory == task.category);
    }

    //Filtering for Priority
    const filterPriorityElement = document.querySelector('.filter-priority');
    this.filterPriority = filterPriorityElement.value;
    if (this.filterPriority != 'All' && this.filterPriority != 'all'){
      filteredTasks = filteredTasks.filter(task => this.filterPriority == task.priority);
    }
    
    return filteredTasks;
  }

  // Filter the tasks based on the string entered in the search bar 
  searchTasks (searchTerm) {
    const taskList = document.querySelectorAll('.task');
    taskList.forEach(task => {
      const taskName = task.querySelector('.task-name');
      const name = taskName.textContent;
      console.log(name);
      
      // Hide and show elements based on matching the search term
  });
  }
}

export default FilterManager;