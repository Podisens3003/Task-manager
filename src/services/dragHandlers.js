import { appState } from "../app";
import { UserTask } from "../models/Tasks";
import { addTasksToState, renderTasks } from "./addTask";
let fromStatus = null;
let taskID = null;
export function dragstartHandler(e) {
  e.dataTransfer.effectAllowed = "move";
  fromStatus = e.target.parentElement.id;
  taskID = e.srcElement.id;
}

export function dragoverHandler(e) {
  e.preventDefault();
  e.dataTransfer.effectAllowed = "move";
}

export function gragenterHandler(e) {
  e.preventDefault();
  this.style.backgroundColor = "rgba(0,0,0, .3)";
}

export function gragleaveHandler(e) {
  e.preventDefault();
  this.style.backgroundColor = "rgba(0,0,0, .0)";
}

export function dropHandler(e) {
  e.preventDefault();
  const selectedDNDTask = appState.tasks[fromStatus].find(
    (task) => taskID === task.id
  );
  let toStatus = e.srcElement.id;
  UserTask.delete(selectedDNDTask);
  selectedDNDTask.status = toStatus;
  UserTask.save(selectedDNDTask);

  this.style.backgroundColor = "rgba(0,0,0, .0)";
  addTasksToState();
  renderTasks();
}
