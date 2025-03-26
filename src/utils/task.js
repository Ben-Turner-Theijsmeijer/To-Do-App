class Task {
  
  constructor(name, date, time, category, priority, completed, recurring, description) {
    this.name = name;
    this.date = date;
    this.time = time;
    this.category = category;
    this.priority = priority;
    this.completed = completed;
    this.recurring = recurring;
    this.description = description;
    
    this.updateTimeString();
    this.recurringUpdated = false;
  }

  // Single responsibility: Task updates itself
  updateTask(name, date, time, category, priority, completed, recurring, description){
    this.name = name;
    this.date = date;
    this.time = time;
    this.category = category;
    this.priority = priority;
    this.completed = completed;
    this.recurring = recurring;
    this.description = description;
  }

  updateTimeString(){
    const savedTimeFormat = localStorage.getItem('timeFormat24Hr');
    let formattedTime;
      
      if (savedTimeFormat === 'true' || !this.time) { // 24 hour format
        formattedTime = `${this.time}`;
      }
      else { // 12 hour format
        const [hours, minutes] = this.time.split(':').map(Number); // Split and convert to numbers
        const period = hours >= 12 ? 'PM' : 'AM'; // Determine AM or PM
        const hours12 = hours % 12 || 12;
        formattedTime = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
      }

      // recalculated with every trigger of the function in updateList
      this.dateText = this.time? this.date + ", " +  formattedTime : this.date; 
      this.timeString = formattedTime;
  }

  updateRecurringTask(){
    if (this.recurring && this.completed){
      let dateObj = new Date(`${this.date} ${this.time || "00:00"}`);
      
      if (this.recurring === 'Daily'){
        dateObj.setDate(dateObj.getDate() + 1);
      }
      else if (this.recurring === 'Weekly'){
        dateObj.setDate(dateObj.getDate() + 7);
      }
      else if (this.recurring === 'Monthly'){
        console.log(dateObj);
        dateObj.setMonth(dateObj.getMonth() + 1);
        console.log(dateObj);
      }

      // Ensures that even if you uncheck and check it back, it won't create another instance of the task
      this.recurringUpdated = true;

      let year = dateObj.getFullYear();
      let month = String(dateObj.getMonth() + 1).padStart(2, '0');
      let day = String(dateObj.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    }
  }

  isOverdue(){
    // If the task is complete there will be no icons showing.
    if (this.completed){
      return '';
    }

    let currentDate = new Date();
    let dateObj = new Date(`${this.date} ${this.time ? `${this.time}:59` : "23:59:59"}`);
    let returnString = '';

    if (dateObj.toDateString() == currentDate.toDateString()){
      returnString = 'due';
    }
    if (dateObj < currentDate){
      returnString = 'overdue';
    }

    return returnString;
  }

  isEqual(task){
    if (this.name == task.name && this.date == task.date && this.time == task.time && this.category == task.category && this.priority == task.priority && this.completed == task.completed){
      return true;
    }
    return false;
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

    // Check if task has been updated before
    if (!task.recurringUpdated && task.recurring){
      let newDate = task.updateRecurringTask();
      taskList.taskList.push(new Task(task.name, newDate, task.time, task.category, task.priority, false, task.recurring))
    }

    taskList.updateAndDisplayTaskList();
    taskList.updateTaskCounter();
  }

}

export default Task;