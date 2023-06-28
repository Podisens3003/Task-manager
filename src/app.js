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

export const appState = new State();

const navbarSupportedContent = document.querySelector("#navbarSupportedContent");

navbarSupportedContent.innerHTML += loginFormTemplate;
const loginForm = document.querySelector("#app-login-form");

generateTestUser(User);
generateTestTasks(UserTask);

// loginForm.addEventListener("submit", function (e) {
//   e.preventDefault();
//   const formData = new FormData(loginForm);
//   const login = formData.get("login");
//   const password = formData.get("password");

  let fieldHTMLContent = authUser(1, 1) // FIXME: не релизить
    ? taskFieldTemplate
    : noAccessTemplate;

  document.querySelector("#content").innerHTML = fieldHTMLContent;

  if (authUser(1, 1)) {
    
    addTasksToState();
    renderTasks()
// console.log('id', appState.currentUser['id']);

    navbarSupportedContent.removeChild(loginForm);
    navbarSupportedContent.innerHTML += loggedUserTemplate;

    listenAvatarClick();
    greeting(appState.currentUser.login)
    console.log('appState', appState.currentUser)
  } 
// });


export function greeting(login) {
  const name = document.querySelector('.user-name');
  name.innerText = login
}

function listenAvatarClick() {
  const dropdown = document.querySelector('.dropdown');
  const arrow = document.querySelector('.dropdown-custom__arrow');

  dropdown.addEventListener('show.bs.dropdown', function () {
    arrow.classList.add('dropdown-custom__arrow_active');
  })
  dropdown.addEventListener('hide.bs.dropdown', function () {
    arrow.classList.remove('dropdown-custom__arrow_active');
  })
}
