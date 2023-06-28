import { appState } from "./app";

export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const addToStorage = function (obj, key) {
  const storageData = getFromStorage(key);
  storageData.push(obj);
  localStorage.setItem(key, JSON.stringify(storageData));
};

export const deleteFromStorage = function (obj, key) {
  const storageData = getFromStorage(key)
    .filter(storageObj => storageObj.id !== obj.id);
  localStorage.setItem(key, JSON.stringify(storageData));
};

export const generateTestUser = function (User) {
  localStorage.clear();
  User.save(new User("test", "qwerty123", "admin"));
  User.save(new User("1", "1"));
  User.save(new User("podisens", "123"));
};

export const generateTestTasks = function (Task) {
  const usersFromStorage = getFromStorage('users');
  // if (!getFromStorage('tasks')) {
  //   return;
  // }

  const task = new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[1].id);
  Task.save(task);
  const task2 = new Task("Sprint bugfix", "Lorem ipsum121859189774156", "backlog", usersFromStorage[1].id)
  Task.save(task2);
  const task3 = new Task("Shop page – performance issues", "Lorem ipsum", "ready", usersFromStorage[0].id)
  Task.save(task3);


  Task.save(new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[1].id))
  Task.save(new Task("Login ryertpage ready", "Lorem ipsum", "ready", usersFromStorage[1].id))
  // Task.save(new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[1].id))
  // Task.save(new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[1].id))
  // Task.save(new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[1].id))
  // Task.save(new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[1].id))
  // Task.save(new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[1].id))
  // Task.save(new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[1].id))
  // Task.save(new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[1].id))
  // Task.save(new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[1].id))
  // Task.save(new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[1].id))
  // Task.save(new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[1].id))
  // Task.save(new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[1].id))
  // Task.save(new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[1].id))
  Task.save(new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[1].id))
  Task.save(new Task("Login page 8", "Lorem ipsum", "backlog", usersFromStorage[1].id))
  Task.save(new Task("Login page 9", "Lorem ipsum", "backlog", usersFromStorage[1].id))
};