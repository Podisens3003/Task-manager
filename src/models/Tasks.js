import { BaseModel } from "./BaseModel";
import { addToStorage, deleteFromStorage } from "../utils";
export class UserTask extends BaseModel {

    constructor(title, description, status, authorId) {
        super();
        this.title = title;
        this.description = description;
        this.status = status;
        this.storageKey = "tasks";
        this.authorId = authorId;
    }

    static save(task) {
        try {
            addToStorage(task, task.storageKey);
            return true;
        } catch (e) {
            throw new Error(e);
        }
    }

    static delete(task) {
        try {
            deleteFromStorage(task, task.storageKey);
            return true;
        } catch (e) {
            throw new Error(e);
        }
    }
}
