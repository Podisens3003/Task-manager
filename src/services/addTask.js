import { appState } from "../app";
import { getFromStorage } from "../utils";
import { UserTask } from "../models/Tasks";
import tasksDropdownTemplate from "../templates/tasksDropdown.html";
import * as bootstrap from "bootstrap/dist/js/bootstrap";


export function addTasksToState() {
    appState.tasks = getFromStorage('tasks');
    // console.log('appState', appState)
}

export function renderTasks() {
    for (let status in appState.tasks) {
        const todos = document.querySelector(`#${status}`)
        todos.innerHTML = null;

        appState.tasks[status].forEach(task => {
            const todo = document.createElement('div');
            todo.classList.add('p-2', 'mb-3', 'bg-light', 'task-item');
            todo.id = task.id;
            todo.innerText = task.title;
            todos.appendChild(todo);
        })
    }

    listenAddTaskClick();
    listenTaskClick();
}

function listenAddTaskClick() {
    const taskStatuses = Object.keys(appState.tasks);
    // console.log('taskStatuses', taskStatuses);

    document.querySelectorAll('.task-group > .btn').forEach(button => {
        button.onclick = ev => {
            console.log('ev', ev)
            let currentTaskList = ev.target.previousElementSibling;
            let changeTask = taskStatuses.indexOf(currentTaskList.id) - 1;

            // console.log("currentTaskList", currentTaskList);
            let tasksFromPreviousStatus = appState.tasks[taskStatuses[changeTask]];
            console.log("tasksFromPreviousStatus", tasksFromPreviousStatus);
            if (tasksFromPreviousStatus.length === 0) return;

            if (currentTaskList.querySelector('.dropdown')) {
                const dropdownSelector = currentTaskList.querySelector('.dropdown-custom__arrow');
                let selectedTask = tasksFromPreviousStatus.find(task => task.id === dropdownSelector.id);
                console.log(selectedTask)
                UserTask.delete(selectedTask);
                selectedTask.status = currentTaskList.id;
                UserTask.save(selectedTask);

                addTasksToState();
                button.onclick = null;
                renderTasks();

                button.innerText = '+ Add card';
                button.classList.remove('btn-primary');
                return;
            }
            if (document.querySelectorAll('.dropdown').length > 1) return;


            button.innerText = 'Submit';
            button.classList.add('btn-primary');
            button.disabled = true;


            // вставляем шаблон в поле тасок
            currentTaskList.innerHTML += tasksDropdownTemplate;
            let ul = document.querySelector(".dropdown-tasks");
            // логика для отрисовки названий тасок в ДД
            tasksFromPreviousStatus.forEach((task) => {
                let li = document.createElement('li');
                li.classList.add('dropdown-item');
                li.id = `${task.id}`;
                li.textContent = `${task.title}`;
                ul.appendChild(li);

                li.addEventListener('click', (ev) => {
                    const dropdownSelector = currentTaskList.querySelector('.dropdown-custom__arrow');
                    dropdownSelector.innerText = ev.target.innerText;
                    dropdownSelector.id = ev.target.id;
                    button.disabled = false;
                    // console.log(ev.target);
                })
            })
        };
    })
}

function listenTaskClick() {
document.querySelectorAll('.task-item').forEach( task =>{
    task.addEventListener('click', (e) => {
      console.log(e.target.id);
      const clickedTaskId = e.target.id;
      const status = e.target.parentElement.id;
      console.log(appState.tasks[status].find( task => task.id === clickedTaskId));
      const clickedItem = appState.tasks[status].find( task => task.id === clickedTaskId);
  
      const modal = new bootstrap.Modal(document.getElementById('exampleModal'), {})
      document.querySelector(".modal-body > p").innerHTML = clickedItem.description;
      document.querySelector(".modal-title").innerHTML = clickedItem.title;
  
      modal.show();
    })
  })
}