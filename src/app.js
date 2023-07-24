import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import loginFormTemplate from "./templates/loginForm.html";
import loggedUserTemplate from "./templates/loggedUser.html";
import tasksDropdownTemplate from "./templates/tasksDropdown.html";
import { User } from "./models/User";
import { UserTask } from "./models/Tasks";
import { generateTestUser, generateTestTasks } from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";
import { addTasksToState, renderTasks } from "./services/addTask";
import { renderNavBar } from "./services/listOfUsers"

export const appState = new State();

const navbarSupportedContent = document.querySelector("#navbarSupportedContent");

navbarSupportedContent.innerHTML += loginFormTemplate;
const loginForm = document.querySelector("#app-login-form");

generateTestUser(User);
generateTestTasks(UserTask);

loginForm.addEventListener("submit", handleUserLogin);

function handleUserLogin(e) {
  e.preventDefault();
  const formData = new FormData(document.querySelector("#app-login-form"));
  const login = formData.get("login");
  const password = formData.get("password");
  const isUserAuthed = authUser(login, password); 

  let fieldHTMLContent = isUserAuthed ? taskFieldTemplate : noAccessTemplate;

  document.querySelector("#content").innerHTML = fieldHTMLContent;

  if (isUserAuthed) {
    addTasksToState();
    renderTasks();
    renderAvatar();
    renderNavBar();
    greeting(appState.currentUser.login);
    console.log("appState", appState.currentUser);
  }
}

function greeting(login) {
  const name = document.querySelector(".user-name");
  name.innerText = login;
}

function renderAvatar() {
  navbarSupportedContent.removeChild(document.querySelector("#app-login-form"));
  navbarSupportedContent.innerHTML += loggedUserTemplate;

  if (appState.currentUser.role === "admin") {
    const addUserOption = document.createElement("li");
    addUserOption.innerText = "Добавить пользователя";
    addUserOption.classList.add("dropdown-item", "add-new-user");

    const avatarDropdownOptions = document.querySelector(
      "#logged-user .dropdown-menu"
    );
    avatarDropdownOptions.appendChild(addUserOption);
    document.querySelector(".add-new-user").addEventListener("click", () => {

    });
  }

  document.querySelector(".logout").addEventListener("click", logOut);

  listenAvatarClick();
}

function logOut() {
  appState.currentUser = null;
  appState.tasks = [];
  navbarSupportedContent.removeChild(document.querySelector("#logged-user"));
  navbarSupportedContent.innerHTML += loginFormTemplate;
  document.querySelector("#app-login-form").addEventListener("submit", handleUserLogin);

  document.querySelector("#content").innerHTML = null;
}

function listenAvatarClick() {
  const dropdown = document.querySelector(".dropdown");
  const arrow = document.querySelector(".dropdown-custom__arrow");

  dropdown.addEventListener("show.bs.dropdown", function () {
    arrow.classList.add("dropdown-custom__arrow_active");
  });
  dropdown.addEventListener("hide.bs.dropdown", function () {
    arrow.classList.remove("dropdown-custom__arrow_active");
  });
}
