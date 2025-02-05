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
  setDefaultDateTime() {
    const inputDateElement = document.querySelector('.js-date-input');
    const inputTimeElement = document.querySelector('.js-time-input');
  
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].slice(0, 5);
  
    inputDateElement.value = date;
    inputDateElement.min = date; // Set the min attribute to today's date
    inputTimeElement.value = time;
    inputTimeElement.min = time; // Set the min attribute to current time
  }

  // this shows the sucessNotification for 4000ms
  successNotification() {
    const success = document.getElementById('js-success-notification');
    success.style.display = 'flex';
    setTimeout(() => {
      success.style.display = 'none';
    }, 4000);
  }

  // eslint-disable-next-line no-unused-vars
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