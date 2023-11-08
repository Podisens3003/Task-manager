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
import { authUser, deleteCookie, getCookie } from "./services/auth";
import { addTasksToState, renderTasks, renderFooter } from "./services/addTask";
import { renderNavBar } from "./services/listOfUsers";

export const appState = new State();

const navbarSupportedContent = document.querySelector(
  "#navbarSupportedContent"
);
navbarSupportedContent.innerHTML += loginFormTemplate;
const loginForm = document.querySelector("#app-login-form");

if (getCookie("user")) getInfoFromCookie();
generateTestUser(User);
generateTestTasks(UserTask);

loginForm.addEventListener("submit", handleUserLogin);

const getInfoFromCookie = () => {
  const cookie = JSON.parse(getCookie("user"));
  renderPage(cookie.login, cookie.password);
};

function handleUserLogin(e) {
  e.preventDefault();
  const formData = new FormData(document.querySelector("#app-login-form"));
  const login = formData.get("login");
  const password = formData.get("password");
  renderPage(login, password);
}

function greeting(login) {
  const name = document.querySelector(".user-name");
  name.innerText = login;
}

function renderPage(login, password) {
  const isUserAuthed = authUser(login, password);
  let fieldHTMLContent = isUserAuthed ? taskFieldTemplate : noAccessTemplate;

  document.querySelector("#content").innerHTML = fieldHTMLContent;

  if (isUserAuthed) {
    addTasksToState();
    renderTasks();
    renderAvatar();
    renderNavBar();
    greeting(appState.currentUser.login);
  }
}

function renderAvatar() {
  navbarSupportedContent.removeChild(document.querySelector("#app-login-form"));
  navbarSupportedContent.innerHTML += loggedUserTemplate;

  document.querySelector(".logout").addEventListener("click", logOut);

  listenAvatarClick();
}

function logOut() {
  deleteCookie(getCookie("user"));
  appState.currentUser = null;
  appState.tasks = [];
  navbarSupportedContent.removeChild(document.querySelector("#logged-user"));
  navbarSupportedContent.innerHTML += loginFormTemplate;
  document
    .querySelector("#app-login-form")
    .addEventListener("submit", handleUserLogin);

  document.querySelector("#content").innerHTML = null;
  renderFooter();
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
