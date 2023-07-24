export class State {
  constructor() {
    this.currentUser = null;
    this.tasks = {
      backlog: [],
      ready: [],
      inProgress: [],
      finished: [],
    };
  }

  set currentUser(user) {
    this._currentUser = user;
  }

  get currentUser() {
    return this._currentUser;
  }

  set tasks(tasks) {
    if (!Array.isArray(tasks)) {
      this._tasks = tasks;
      return;
    }

    const tasksStatusKeys = Object.keys(this._tasks);

    tasksStatusKeys.forEach(taskStatus => {
      this._tasks[taskStatus] = [];

      const tasksAtStatus = tasks
        .filter(task => task.status === taskStatus)
        .filter(task => this.currentUser.role === "admin" ? true : task.authorId === this._currentUser.id);

      this._tasks[taskStatus].push(...tasksAtStatus)
    })
  }
  
  get tasks() {
    return this._tasks;
  }
}
