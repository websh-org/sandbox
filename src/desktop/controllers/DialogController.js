import { observable, action, reaction, computed } from "mobx";
import { Controller, readonly, internal, command } from "~/lib/Controller";

export const DialogController = Controller(class DialogStore extends Controller.Store {

  constructor({ type, data = {}, ...rest }) {
    super(rest)
    this.data = data;
    this.type = type;
  }

  @readonly
  @observable
  type = null;

  @readonly
  @observable
  data = null;

  @command
  "resolve"(result) {
    this._promise.resolve(result);
  }

  @command
  "reject"(result) {
    this._promise.reject(result);
  }
  @command
  "show"() {
    return new Promise((resolve, reject) => {
      this._promise = { resolve, reject }
    })
  }
})