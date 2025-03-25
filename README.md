# To-Do-List

<!-- This works on Gitlab -->
<!-- <img width="950" alt="{To Do Manager}" src="/readme-imgs/To Do Manager.png"> -->
![Landing](/readme-imgs/Landing.png)

- Simple
- Interactive
- Built with HTML, CSS, and JavaScript

## Features

- Add new tasks
- Edit existing tasks
- Delete tasks
- Set a due date for each task
- Sort and filter by:
  - Priority
  - Category
  - Date & Time
- View tasks in a:
  - List
  - Calendar
  - Board

## Installation

1. Clone the repository: `git clone https://gitlab.socs.uoguelph.ca/cis42503/groverio-to-do-list.git`
2. Install the [Live Preview Extension by Microsoft](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server) in Visual Studio Code (VSCode)
3. Open the repository in VSCode
4. Click "Go Live" in the bottom right corner of VSCode

## To Do Manager

![To Do Manager](/readme-imgs/To%20Do%20Manager.png)

### Primary To Do Manager Usage

- **Add a Task:** Enter a task in the input field and click the "Add" button. All tasks must have a name.
- **Edit a Task:** Click the edit icon next to the task, make your changes, and save by clicking "Update." You may also click "Cancel" to discard all your changes.
- **Delete a Task:** Click the delete icon next to the task.

### Other To Do Manager Capabilities

- **Export Tasks:** Download a CSV file, containing all tasks currently in your list
- **Upload Tasks:** Upload a CSV file to add tasks to your list
  - Limitation: This will create duplicate tasks, if you export/upload the same file without deleting any
- **Recurring Tasks:** Whether daily, weekly, or monthly, a new task with the same information will be created for the next due date automatically when the existing one is marked as complete
- **Sort:** Sort by ascending or descending order of the selected option (Category, Priority, or Date)
- **Filter:** Filter the list to only display the selected options (Completion status, Category, Priority)
- **Search:** Find a task based on its name
<!-- (TODO: any other things search will check?) -->

## Calendar

### Caendar Capabilities

- View tasks on the days they're due
- View by month or by week
- View tasks without a due date below the calendar
- Navigate back to "Today" if you are looking at other months/weeks than the current one
- Look at specific task details by clicking on them

### Month View

![Calendar Month View](/readme-imgs/Calendar%20Month.png)

### Week View

![Calendar Week View](/readme-imgs/Calendar%20Week.png)

### Task Popup

![Calendar Task Popup](/readme-imgs/Calendar%20Popup.png)

## Board View

<!-- TODO: Add this section -->
Awaiting changes from Sprint 4 to include this.

## 👀 Previous Contributors

Thank you to all developers who have contributed to this project prior to our project.

<div align="center">
  <a href="https://github.com/Groverio/To-Do-List">
    <img src="https://contrib.rocks/image?repo=Groverio/To-Do-List" />
  </a>
</div>

You can find the original repository at [Groviero's To-Do-List](https://github.com/Groverio/To-Do-List)
