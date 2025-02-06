class Task {
  constructor(name, date, time, category, priority, completed) {
    this.name = name;
    this.date = date;
    this.time = time;
    this.category = category;
    this.priority = priority;
    this.completed = completed;
  }

  // ORIGINAL FUNCTIONS PORTED OVER

  // this shows the sucessNotification for 4000ms
  successNotification() {
    const success = document.getElementById('js-success-notification');
    success.style.display = 'flex';
    setTimeout(() => {
      success.style.display = 'none';
    }, 4000);
  }

  // eslint-disable-next-line no-unused-vars

  // This should be completely changed... just to the task item.
  // Broken for now
  toggleComplete(index) {
    todoList[index].completed = !todoList[index].completed;
    if (todoList[index].completed) {
      successNotification();
    }
    localStorage.setItem('todoList', JSON.stringify(todoList));
    updateTodoList();
    updateTaskCounter();
  }
}