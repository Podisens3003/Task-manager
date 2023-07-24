import { appState } from "../app";
import listOfUsersPopupTemplate from "../templates/usersPopup.html";
import * as bootstrap from "bootstrap/dist/js/bootstrap";
import { getFromStorage } from "../utils";
import { User } from "../models/User";



export function renderNavBar() {
  if (appState.currentUser.role === "admin") {
    let usersListBtn = document.querySelector(".nav-item:last-child");
    usersListBtn.style.display = "block";
    usersListBtn.addEventListener("click", generateListOfUsers);
  }
}

function generateListOfUsers() {
  document.querySelector(".list-of-users").innerHTML = listOfUsersPopupTemplate;
  const usersListsPopup = new bootstrap.Modal(
    document.getElementById("users-modal")
  );
  const localStorageUsers = getFromStorage("users");
  localStorageUsers.forEach((user) => renderUserItem(user));

  usersListsPopup.show();

  const buttonAddUser = document.querySelector(".add-user");
  buttonAddUser.addEventListener("click", addNewUser);
}

function renderUserItem(user) {
  const { wrapper, userCell, actionBtn } = generateUserItem(user);
  wrapper.appendChild(userCell);
  if (appState.currentUser.id !== user.id){
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
    userCell.innerHTML = `<span> id: <span class="id">${user.id}</span></span>`;
    userCell.innerHTML += `<span> login: ${user.login} </span>`;
    userCell.innerHTML += `<span> password: ${user.password} </span>`;
  } else {
    userCell.id = "add-user-form";
    userCell.innerHTML += `<span> login: </span><input class="new-login" required>`;
    userCell.innerHTML += `<span> password: </span><input class="new-password" required>`;
    userCell.innerHTML += `<div>
    <input type="radio" name="role" class="role" id="user-radio" value="user" checked>
    <label for="user-radio">User</label>
    <input type="radio" name="role" class="role" id="admin-radio" value="admin">
    <label for="admin-radio">Admin</label>
    </div>`;

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
  let role = "user";
  let radio = formFromUser.querySelectorAll('.role');
  radio.forEach(element => {
    if (element.checked) {
      role = element.value;
    }
  });
  User.save(new User(newLogin, newPassword, role));
  generateListOfUsers();
}

function deleteUser(ev){
  const localStorageUsers = getFromStorage("users");
  const userInfo = ev.target.previousElementSibling;
  const userId = userInfo.querySelector('.id').innerText;
  let selectedUser = localStorageUsers.find(user => user.id === userId);
  User.delete(selectedUser);
  generateListOfUsers();
}