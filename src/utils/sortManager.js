class SortManager {
  constructor() {
    this.SortMethod = ""; //Default sort method
    this.currentPrioritySortOrder = "asc"; // Default sort order for priority
    this.currentCategorySortOrder = "asc"; // Default sort order for category
    this.currentDateSortOrder = "asc"; // Default sort order for date
  }

  // sorts the passed list of tasks based on the set priority or category
  sortTasks(unsortedTasks, sortBy) {
    // set to either ascending or descending sort order
    if (sortBy === "priority") {
      // change sort order
      this.currentPrioritySortOrder =
        this.currentPrioritySortOrder === "asc" ? "desc" : "asc";
      // update asc/desc icon
      const sortBtn = document.getElementById("sort-priority-order");
      sortBtn.classList = "";
      if (this.currentPrioritySortOrder === "asc") {
        sortBtn.classList.add("fa-solid", "fa-arrow-down");
      } else {
        sortBtn.classList.add("fa-solid", "fa-arrow-up");
      }
    } else if (sortBy === "category") {
      // change sort order
      this.currentCategorySortOrder =
        this.currentCategorySortOrder === "asc" ? "desc" : "asc";
      // update asc/desc icon
      const sortBtn = document.getElementById("sort-category-order");
      sortBtn.classList = "";
      if (this.currentCategorySortOrder == "asc") {
        sortBtn.classList.add("fa-solid", "fa-arrow-down");
      } else {
        sortBtn.classList.add("fa-solid", "fa-arrow-up");
      }
    } else if (sortBy === "date") {
      // change sort order
      this.currentDateSortOrder =
        this.currentDateSortOrder === "asc" ? "desc" : "asc";
      // update asc/desc icon
      const sortBtn = document.getElementById("sort-date-order");
      sortBtn.classList = "";
      if (this.currentDateSortOrder === "asc") {
        sortBtn.classList.add("fa-solid", "fa-arrow-down");
      } else {
        sortBtn.classList.add("fa-solid", "fa-arrow-up");
      }
    }

    // check if the sort criteria changed before setting it
    if (sortBy !== "") this.SortMethod = sortBy;

    // sort the list either ascending or descending based on sort criteria
    let sortedTasks = unsortedTasks;
    sortedTasks.sort((a, b) => {
      if (this.SortMethod === "date") {
        let dateA = new Date();
        let dateB = new Date();
        if (a.date == "" || b.date == "") {
          // if either date null, skip setting date
        } else if (a.time == "" || b.time == "") {
          // if either time null, only compare date
          dateA = new Date(a.date + " 00:00");
          dateB = new Date(b.date + " 00:00");
        } else {
          // else compare date and time
          dateA = new Date(a.date + " " + a.time);
          dateB = new Date(b.date + " " + b.time);
        }
        // return asc/desc sort order
        return this.currentDateSortOrder === "asc"
          ? dateA - dateB
          : dateB - dateA;
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
