import { appState } from "../app";
import { getFromStorage } from "../utils";
import { User } from "../models/User";
import { UserTask } from "../models/Tasks";
import { renderTasks , addTasksToState } from "../services/addTask.js";
import listOfUsersPopupTemplate from "../templates/usersPopup.html";
import * as bootstrap from "bootstrap/dist/js/bootstrap";

export function renderNavBar() {
  if (appState.currentUser.role === "admin") {
    let usersListBtn = document.querySelector(".nav-item:last-child");
    usersListBtn.style.display = "block";
    usersListBtn.addEventListener("click", generateListOfUsers);
  }
}

function generateListOfUsers() {
  appState.usersPoppupRef && appState.usersPoppupRef.hide();

  document.querySelector(".list-of-users").innerHTML = listOfUsersPopupTemplate;

  appState.usersPoppupRef = new bootstrap.Modal(
    document.getElementById("users-modal")
  );
  const localStorageUsers = getFromStorage("users");
  localStorageUsers.forEach((user) => renderUserItem(user));

  appState.usersPoppupRef.show();

  const buttonAddUser = document.querySelector(".add-user");
  buttonAddUser.addEventListener("click", addNewUser);
}

function renderUserItem(user) {
  const { wrapper, userCell, actionBtn } = generateUserItem(user);
  wrapper.appendChild(userCell);
  
  if (appState.currentUser.id !== user.id) {
    wrapper.appendChild(actionBtn);
    actionBtn.onclick = deleteUser;
  }

  document.querySelector("#users-modal .modal-body").appendChild(wrapper);
}

function addNewUser(ev) {
  ev.target.disabled = true;
  const { wrapper, userCell, actionBtn } = generateUserItem();

  wrapper.appendChild(userCell);
  wrapper.appendChild(actionBtn);
  userCell.onsubmit = saveNewUser;

  document.querySelector("#users-modal .modal-body").prepend(wrapper);
}

function generateUserItem(user = null) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");

  const userCell = document.createElement(user ? "div" : "form");
  userCell.classList.add("user-cell");

  if (user) {
    userCell.innerHTML += `
      <span> id: <span class="id">${user.id}</span></span>
      <span> login: ${user.login} </span>
      <span> password: ${user.password} </span>
    `;
  } else {
    userCell.id = "add-user-form";
    userCell.innerHTML += `
      <span> login: </span><input class="new-login" required>
      <span> password: </span><input class="new-password" required>
      <div>
        <input type="radio" name="role" class="role" id="user-radio" value="user" checked>
        <label for="user-radio">User</label>
        <input type="radio" name="role" class="role" id="admin-radio" value="admin">
        <label for="admin-radio">Admin</label>
      </div>
    `;
  }

  return { wrapper, userCell, actionBtn: generateActionBtn(user) };
}

function generateActionBtn(user = null) {
  const actionBtn = document.createElement("button");
  actionBtn.classList.add(
    "btn",
    "render-per-user",
    user ? "btn-danger" : "btn-outline-success"
  );
  actionBtn.innerText = user ? "delete" : "save";

  !user && actionBtn.setAttribute("form", "add-user-form");

  return actionBtn;
}

function saveNewUser(ev) {
  ev.preventDefault();
  const formFromUser = ev.target;
  const newLogin = formFromUser.querySelector('.new-login').value;
  const newPassword = formFromUser.querySelector('.new-password').value;
  const selectedRole = Array.from(formFromUser.querySelectorAll('.role'))
    .find(element => element.checked).value;
  User.save(new User(newLogin, newPassword, selectedRole));

  generateListOfUsers();
}

function deleteUser(ev) {
  const userInfo = ev.target.previousElementSibling;
  const userId = userInfo.querySelector('.id').innerText;

  const localStorageUsers = getFromStorage("users");
  const selectedUser = localStorageUsers.find(user => user.id === userId);
  User.delete(selectedUser);

  let localStorageTasks = getFromStorage('tasks');
  const loginUser = localStorageTasks.filter(task => task.authorId === userId);
  loginUser.forEach(task => {UserTask.delete(task)})

  addTasksToState();
  renderTasks();
  generateListOfUsers();
}