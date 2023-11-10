export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const addToStorage = function (obj, key) {
  const storageData = getFromStorage(key);
  storageData.push(obj);
  localStorage.setItem(key, JSON.stringify(storageData));
};

export const deleteFromStorage = function (obj, key) {
  const storageData = getFromStorage(key).filter(
    (storageObj) => storageObj.id !== obj.id
  );
  localStorage.setItem(key, JSON.stringify(storageData));
};

export const generateTestUser = function (User) {
  if (getFromStorage("users").length) {
    return;
  }
  User.save(new User("test", "qwerty123", "admin"));
  User.save(new User("1", "1"));
  User.save(new User("podisens", "123"));
};

export const generateTestTasks = function (Task) {
  const usersFromStorage = getFromStorage("users");
  if (getFromStorage("tasks").length) {
    return;
  }

  Task.save(new Task("Shop page – performance issues", "Lorem ipsum1", "ready", usersFromStorage[0].id));
  Task.save(new Task("Login page – performance issues", "Lorem ipsum2", "backlog", usersFromStorage[0].id))
  Task.save(new Task("Login page 8", "Lorem ipsum3", "backlog", usersFromStorage[0].id))
  Task.save(new Task("Login page 9", "Lorem ipsum4", "backlog", usersFromStorage[0].id))
  Task.save(new Task("Login page 9", "Lorem ipsum5", "backlog", usersFromStorage[0].id))
  Task.save(new Task("Login page – performance issues", "Lorem ipsum6", "inProgress", usersFromStorage[0].id))
  Task.save(new Task("Login page 8", "Lorem ipsum", "inProgress", usersFromStorage[0].id))
  Task.save(new Task("Login page 9", "Lorem ipsum", "inProgress", usersFromStorage[0].id))
  Task.save(new Task("Login page 9", "Lorem ipsum", "inProgress", usersFromStorage[0].id))
  Task.save(new Task("Login page – performance issues", "Lorem ipsum", "finished", usersFromStorage[0].id))
  Task.save(new Task("Login page 8", "Lorem ipsum", "finished", usersFromStorage[0].id))
  Task.save(new Task("Login page 9", "Lorem ipsum", "finished", usersFromStorage[0].id))
  Task.save(new Task("Login page 9", "Lorem ipsum", "finished", usersFromStorage[0].id)) 

  Task.save(new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[1].id));
  Task.save(new Task("Sprint bugfix", "Lorem ipsum121859189774156", "backlog", usersFromStorage[1].id));
  Task.save(new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[1].id))
  Task.save(new Task("Login ryertpage ready", "Lorem ipsum", "ready", usersFromStorage[1].id))
  Task.save(new Task("Login ryertpage ready", "Lorem ipsum", "inProgress", usersFromStorage[1].id))
  Task.save(new Task("Login ryertpage ready", "Lorem ipsum", "finished", usersFromStorage[1].id))

  Task.save(new Task("Login page – performance issues", "Lorem ipsum", "backlog", usersFromStorage[2].id));
  Task.save(new Task("Sprint bugfix", "Lorem ipsum121859189774156", "ready", usersFromStorage[2].id));
  Task.save(new Task("Login page – performance issues", "Lorem ipsum", "inProgress", usersFromStorage[2].id))
  Task.save(new Task("Login ryertpage ready", "Lorem ipsum", "finished", usersFromStorage[2].id))
};
