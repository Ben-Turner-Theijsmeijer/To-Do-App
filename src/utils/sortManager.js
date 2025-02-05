class SortManager {
  constructor() {
      this.currentSortMethod = 'date' //Defualt sort method
      this.currentSortOrder = 'asc'; // Default sort order for priority
      this.currentCategorySortOrder = 'asc'; // Default sort order for category
  }

  // takes whatever was put in priority & category sections then calls updateTodoList
  sortTodos(sortBy) {
    if (sortBy === 'priority') {
      currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else if (sortBy === 'category') {
      currentCategorySortOrder =
        currentCategorySortOrder === 'asc' ? 'desc' : 'asc';
    }
    currentSortMethod = sortBy;
    updateTodoList();
  }
}