class Task {
  constructor(name, date, time, category, priority, completed) {
    this.name = name;
    this.date = date;
    this.time = time;
    this.category = category;
    this.priority = priority;
    this.completed = completed;
  }

  // Single responsibility: Task updates itself
  updateTask({name, date, time, category, priority, completed}){
    this.name = name;
    this.date = date;
    this.time = time;
    this.category = category;
    this.priority = priority;
    this.completed = completed;
  }

  // this shows the sucessNotification for 4000ms
  static successNotification() {
    const success = document.getElementById('js-success-notification');
    success.style.display = 'flex';
    setTimeout(() => {
      success.style.display = 'none';
    }, 4000);
  }

  // eslint-disable-next-line no-unused-vars

  static toggleComplete(task, taskList) {
    task.completed = !task.completed;
    if (task.completed) {
      Task.successNotification();
    }
    // have this line in updateTaskList
    // localStorage.setItem('taskList', JSON.stringify(taskList));
    taskList.updateTaskList('');
    taskList.updateTaskCounter();
  }

}

export default Task;