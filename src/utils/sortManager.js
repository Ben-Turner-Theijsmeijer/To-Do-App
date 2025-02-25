class SortManager {
  constructor() {
    this.SortMethod = "date"; //Defualt sort method
    this.currentPrioritySortOrder = "asc"; // Default sort order for priority
    this.currentCategorySortOrder = "asc"; // Default sort order for category
  }

  // sorts the passed list of tasks based on the set priority or category
  sortTasks(unsortedTasks, sortBy) {
    // set to either ascending or descending sort order
    if (sortBy === "priority") {
      this.currentPrioritySortOrder =
        this.currentPrioritySortOrder === "asc" ? "desc" : "asc";
    } else if (sortBy === "category") {
      this.currentCategorySortOrder =
        this.currentCategorySortOrder === "asc" ? "desc" : "asc";
    }

    // check if the sort criteria changed before setting it
    if (sortBy !== "") this.SortMethod = sortBy;

    // sort the list either ascending or descending based on sort criteria
    let sortedTasks = unsortedTasks;
    sortedTasks.sort((a, b) => {
      if (this.SortMethod === "date") {
        const dateA = new Date(a.date + " " + a.time);
        const dateB = new Date(b.date + " " + b.time);
        return dateA - dateB;
      } else if (this.SortMethod === "category") {
        return this.currentCategorySortOrder === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      } else if (this.SortMethod === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return this.currentPrioritySortOrder === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
    });

    return sortedTasks;
  }
}

export default SortManager;
