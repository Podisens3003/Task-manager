import { appState } from "../app";
import { getFromStorage } from "../utils";
import { UserTask } from "../models/Tasks";
import tasksDropdownTemplate from "../templates/tasksDropdown.html";
import backlogTaskTemplate from "../templates/backlogTask.html";

import * as bootstrap from "bootstrap/dist/js/bootstrap";
import {
  dragoverHandler,
  dragstartHandler,
  dropHandler,
  gragenterHandler,
  gragleaveHandler,
} from "./dragHandlers";

export function addTasksToState() {
  appState.tasks = getFromStorage("tasks");
}

export function renderTasks() {
  for (let status in appState.tasks) {
    const todos = document.querySelector(`#${status}`);
    todos.innerHTML = null;
    todos.ondragover = dragoverHandler;
    todos.ondragenter = gragenterHandler;
    todos.ondragleave = gragleaveHandler;
    todos.ondrop = dropHandler;
    appState.tasks[status].forEach((task) => {
      const todo = document.createElement("div");
      todo.classList.add("p-2", "mb-3", "bg-light", "task-item");
      todo.style.wordWrap = "break-word";
      todo.id = task.id;
      todo.innerText = task.title;
      todo.style.position = "relative";
      todo.draggable = true;
      todo.ondragstart = dragstartHandler;

      if (appState.currentUser.role === "admin") {
        const author = renderUserName(task.authorId);
        todo.appendChild(author);
      }
      todos.appendChild(todo);
    });
  }
  renderFooter();
  listenAddTaskClick();
  listenTaskClick();
}

function listenAddTaskClick() {
  const taskStatuses = Object.keys(appState.tasks);

  document.querySelectorAll(".task-group > .btn").forEach((button) => {
    button.onclick = (ev) => {
      let currentTaskList = ev.target.previousElementSibling;
      let changeTask = taskStatuses.indexOf(currentTaskList.id) - 1;
      let tasksFromPreviousStatus = appState.tasks[taskStatuses[changeTask]];
      if (tasksFromPreviousStatus && tasksFromPreviousStatus.length === 0)
        return;

      if (currentTaskList.querySelector(".dropdown")) {
        const dropdownSelector = currentTaskList.querySelector(
          ".dropdown-custom__arrow"
        );
        let selectedTask = tasksFromPreviousStatus.find(
          (task) => task.id === dropdownSelector.id
        );
        UserTask.delete(selectedTask);
        selectedTask.status = currentTaskList.id;
        UserTask.save(selectedTask);

        addTasksToState();
        button.onclick = null;
        renderTasks();

        button.innerText = "+ Add card";
        button.classList.remove("btn-primary");
        return;
      }

      if (document.querySelectorAll(".dropdown").length > 1) return;

      button.innerText = "Submit";
      button.classList.add("btn-primary");
      button.disabled = true;

      // вставляем шаблон в поле тасок
      currentTaskList.id === "backlog"
        ? setTaskTemplate(currentTaskList, button)
        : setDropdown(tasksFromPreviousStatus, currentTaskList, button);
    };
  });
}

function setTaskTemplate(currentTaskList, button) {
  currentTaskList.innerHTML += backlogTaskTemplate;

  const newTaskInput = currentTaskList.querySelector(".create-task-input");
  const newTaskField = currentTaskList.querySelector(".new-task-backlog");
  newTaskInput.addEventListener("blur", (e) => {
    if (!newTaskInput.value.trim()) {
      newTaskField.remove();
      button.classList.remove("btn-primary");
      button.innerText = "+ Add card";
      button.disabled = false;

      renderTasks();
      return;
    }
    const task = new UserTask(
      `${newTaskInput.value}`,
      "",
      "backlog",
      `${appState.currentUser.id}`
    );
    UserTask.save(task);
    addTasksToState();
    button.onclick = null;
    renderTasks();

    button.classList.remove("btn-primary");
    button.innerText = "+ Add card";
  });

  button.disabled = false;
  button.onclick = () => {
    if (!newTaskInput.value.trim()) return;
    const task = new UserTask(
      `${newTaskInput.value}`,
      "",
      "backlog",
      `${appState.currentUser.id}`
    );
    UserTask.save(task);
    addTasksToState();
    button.onclick = null;
    renderTasks();

    button.classList.remove("btn-primary");
    button.innerText = "+ Add card";
  };
}

function setDropdown(tasksFromPreviousStatus, currentTaskList, button) {
  currentTaskList.innerHTML += tasksDropdownTemplate;

  let ul = document.querySelector(".dropdown-tasks");
  tasksFromPreviousStatus.forEach((task) => {
    let li = document.createElement("li");
    li.classList.add("dropdown-item");
    li.id = `${task.id}`;
    li.textContent = `${task.title}`;
    ul.appendChild(li);

    li.addEventListener("click", (ev) => {
      const dropdownSelector = currentTaskList.querySelector(
        ".dropdown-custom__arrow"
      );
      dropdownSelector.innerText = ev.target.innerText;
      dropdownSelector.id = ev.target.id;
      button.disabled = false;

      let selectedTask = tasksFromPreviousStatus.find(
        (task) => task.id === dropdownSelector.id
      );
      UserTask.delete(selectedTask);
      selectedTask.status = currentTaskList.id;
      UserTask.save(selectedTask);

      addTasksToState();
      button.onclick = null;
      renderTasks();

      button.innerText = "+ Add card";
      button.classList.remove("btn-primary");
      return;
    });
  });
}

function listenTaskClick() {
  document.querySelectorAll(".task-item").forEach((task) => {
    task.addEventListener("click", (e) => {
      const clickedTaskId = e.target.id;
      const status = e.target.parentElement.id;
      const clickedItem = appState.tasks[status].find(
        (task) => task.id === clickedTaskId
      );
      const modal = new bootstrap.Modal(
        document.getElementById("exampleModal"),
        {}
      );
      document.querySelector(".modal-title").innerHTML = clickedItem.title;

      document.querySelector(".modal-body > .current-description").innerText =
        clickedItem.description;
      let edit = document.querySelector(
        ".modal-body > .task-description-input"
      );
      edit.value = clickedItem.description;
      const buttonDelete = document.querySelector(".btn-outline-danger");
      const saveChanges = document.querySelector(
        ".modal-footer > .btn-primary"
      );

      buttonDelete.addEventListener("click", () =>
        deleteTask(clickedItem, modal)
      );

      modal.show();
      editTaskDescription(clickedItem, saveChanges, edit);
      // deleteTask(buttonDelete, clickedItem)
    });
  });
}

export function renderFooter() {
  let activeTasks = appState.tasks.backlog.length;
  document.querySelector(".active-tasks").innerHTML = activeTasks;
  let finisedTasks = appState.tasks.finished.length;
  document.querySelector(".finished-tasks").innerHTML = finisedTasks;

  let loginUser = appState.currentUser.login;
  let year = new Date().getFullYear();

  document.querySelector(".user-info").innerHTML = `${loginUser}, ${year}`;
}

function editTaskDescription(clickedItem, saveChanges, edit) {
  saveChanges.addEventListener("click", (ev) => {
    clickedItem.description = edit.value;
    let newDescription = clickedItem;
    UserTask.delete(clickedItem);
    UserTask.save(newDescription);
    addTasksToState();
    renderTasks();
  });
}

function deleteTask(clickedItem, modal) {
  UserTask.delete(clickedItem);
  addTasksToState();
  renderTasks();
  modal.hide();
}

function renderUserName(id) {
  let arrOfUsers = getFromStorage("users");
  const loginUser = arrOfUsers.find((user) => user.id === id)?.login;
  const name = document.createElement("span");
  name.classList.add("label-login-user");
  name.style.position = "absolute";
  name.style.top = "-10px";
  name.style.right = "7px";
  name.style.color = "blue";

  name.innerText = loginUser;
  return name;
}
