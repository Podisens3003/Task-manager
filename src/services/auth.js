import { appState } from "../app";
import { User } from "../models/User";
import * as bootstrap from "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { stringify } from "uuid";

export const authUser = function (login, password) {
  const user = new User(login, password);
  const userFromStorage = user.hasAccess;
  if (userFromStorage) {
    setCookie(JSON.stringify({ login: login, password: password }));
  }

  if (!userFromStorage) {
    showToast("Не правильно введен пароль или логин", "red");
    return false;
  }
  appState.currentUser = userFromStorage;
  showToast(`Здравствуйте, ${login}`, "green");
  return true;
};

function showToast(message, toastColor) {
  const toastElem = document.querySelector(".toast");
  const toastBody = document.querySelector(".toast-body");
  toastBody.innerText = message;
  toastBody.style.backgroundColor = toastColor;
  const toast = new bootstrap.Toast(toastElem);
  toast.show();
}

export function getCookie(value) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        value.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(value, maxAge = 36000 * 7) {
  let options = {
    user: value,
    path: "/",

    "max-age": maxAge,
  };
  let updatedCookie = "";

  for (let optionKey in options) {
    updatedCookie += optionKey + "=" + options[optionKey] + "; ";
  }

  document.cookie = updatedCookie;
}

export function deleteCookie(name) {
  setCookie(name, -1);
}
