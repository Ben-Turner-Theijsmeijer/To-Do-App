class FilterManager {
  constructor() {
    const storedFilters = JSON.parse(localStorage.getItem("filters")) || {};

    // Filters that are being saved to local storage
    this.filters = {
      completion: storedFilters.completion || 'Ongoing',
      category: storedFilters.category || 'All',
      priority: storedFilters.priority || 'All',
    };

    this.searchTerm = '';

    // On load assign values to dropdowns
    document.querySelector(".filter-completion").value = this.filters.completion;
    document.querySelector(".filter-category").value = this.filters.category;
    document.querySelector(".filter-priority").value = this.filters.priority;
  
    console.log(this.filters.category);
  }

  // Filters the to do list based on the selected filter method
  filterTasks(unfilteredTasks) {
    let filteredTasks = unfilteredTasks;
    
    //Filtering for completion
    const filterCompletionElement = document.querySelector('.filter-completion');
    this.filters.completion = filterCompletionElement.value;
    if (this.filters.completion === 'Ongoing') {
      filteredTasks =  filteredTasks.filter(task => !task.completed);
    } else if (this.filters.completion === 'Completed') {
      filteredTasks = filteredTasks.filter(task => task.completed);
    }
    
    //Filtering for Category
    const filterCategoryElement = document.querySelector('.filter-category');
    this.filters.category = filterCategoryElement.value;
    if (this.filters.category != 'All' && this.filters.category != 'All'){
      filteredTasks = filteredTasks.filter(task => this.filters.category == task.category);
    }

    //Filtering for Priority
    const filterPriorityElement = document.querySelector('.filter-priority');
    this.filters.priority = filterPriorityElement.value;
    if (this.filters.priority != 'All' && this.filters.priority != 'All'){
      filteredTasks = filteredTasks.filter(task => this.filters.priority == task.priority);
    }

    //Filtering for Name
    if (this.searchTerm != ''){
      filteredTasks = filteredTasks.filter( task => task.name.toLowerCase().includes(this.searchTerm) )
    }

    this.saveFilterState();
    
    return filteredTasks;
  }

  // Filter the tasks based on the string entered in the search bar 
  setSearchFilter (searchTerm) {
    this.searchTerm = searchTerm.toLowerCase();
  }

  saveFilterState () {
    // Doesn't work as saving an array
    localStorage.setItem("filters", JSON.stringify(this.filters));
  }
}

export default FilterManager;