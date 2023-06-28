import { appState } from "../app";

// import { appState, showToast } from "../app";
import { User } from "../models/User";
import * as bootstrap from "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// import { greeting } from "../app";


export const authUser = function (login, password) {
  const user = new User(login, password);
  const userFromStorage = user.hasAccess;


  if (!userFromStorage) {
    showToast('Не правильно введен пароль или логин', 'red');
    return null;
  }
  appState.currentUser = userFromStorage;
  showToast(`Здравствуйте, ${login}`, 'green');
  return true;
};

function showToast(message, toastColor) {
  const toastElem = document.querySelector('.toast')
  const toastBody = document.querySelector('.toast-body')
  toastBody.innerText = message;
  toastBody.style.backgroundColor = toastColor;
  const toast = new bootstrap.Toast(toastElem)
  toast.show();
}
