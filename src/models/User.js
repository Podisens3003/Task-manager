import { BaseModel } from "./BaseModel";
import { getFromStorage, addToStorage, deleteFromStorage } from "../utils";

export class User extends BaseModel {
  constructor(login, password, role = "user") {
    super();
    this.login = login;
    this.password = password;
    this.role = role;
    this.storageKey = "users";
  }

  get hasAccess() {
    let users = getFromStorage(this.storageKey);
    if (users.length == 0) return false;
    for (let user of users) {
      if (user.login == this.login && user.password == this.password)
        return user;
    }
    return null;
  }

  static save(user) {
    try {
      addToStorage(user, user.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
  
  static delete(user) {
    try {
      deleteFromStorage(user, user.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}
