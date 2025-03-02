class SortManager {
  constructor() {
    this.SortMethod = ""; // Default sort method
    this.currentPrioritySortOrder = "asc"; // Default sort order for priority
    this.currentCategorySortOrder = "asc"; // Default sort order for category
    this.currentDateSortOrder = "asc"; // Default sort order for date
  }

  // Reset all sort icons to default (both arrows)
  resetSortIcons() {
    const sortIcons = {
      priority: document.getElementById("sort-priority-order"),
      category: document.getElementById("sort-category-order"),
      date: document.getElementById("sort-date-order"),
    };

    Object.values(sortIcons).forEach((icon) => {
      if (icon) {
        icon.classList = "";
        icon.classList.add("fa-solid", "fa-arrows-up-down");
      }
    });
  }

  // Sort the passed list of tasks based on the set priority, category, or date
  sortTasks(unsortedTasks, sortBy) {
    if (!["priority", "category", "date"].includes(sortBy)) return unsortedTasks;

    // Reset all icons before updating the selected one
    this.resetSortIcons();

    let sortBtn;
    let sortOrder;

    if (sortBy === "priority") {
      this.currentPrioritySortOrder =
        this.currentPrioritySortOrder === "asc" ? "desc" : "asc";
      sortBtn = document.getElementById("sort-priority-order");
      sortOrder = this.currentPrioritySortOrder;
    } else if (sortBy === "category") {
      this.currentCategorySortOrder =
        this.currentCategorySortOrder === "asc" ? "desc" : "asc";
      sortBtn = document.getElementById("sort-category-order");
      sortOrder = this.currentCategorySortOrder;
    } else if (sortBy === "date") {
      this.currentDateSortOrder =
        this.currentDateSortOrder === "asc" ? "desc" : "asc";
      sortBtn = document.getElementById("sort-date-order");
      sortOrder = this.currentDateSortOrder;
    }

    // Update selected button's icon
    if (sortBtn) {
      sortBtn.classList = "";
      sortBtn.classList.add("fa-solid", sortOrder === "asc" ? "fa-arrow-down" : "fa-arrow-up");
    }

    this.SortMethod = sortBy;

    // Sort logic
    return unsortedTasks.sort((a, b) => {
      if (this.SortMethod === "date") {
        let dateA = a.date ? new Date(`${a.date} ${a.time || "00:00"}`) : new Date();
        let dateB = b.date ? new Date(`${b.date} ${b.time || "00:00"}`) : new Date();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (this.SortMethod === "category") {
        return sortOrder === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      } else if (this.SortMethod === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2, none: 3 };
        let aPriority = priorityOrder[a.priority] ?? priorityOrder["none"];
        let bPriority = priorityOrder[b.priority] ?? priorityOrder["none"];
        return sortOrder === "asc" ? aPriority - bPriority : bPriority - aPriority;
      }
    });
  }
}

export default SortManager;
