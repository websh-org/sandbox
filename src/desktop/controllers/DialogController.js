import { observable, action, reaction, computed } from "mobx";
import { Controller, expose, command } from "~/lib/controller/Controller";

export class DialogController extends Controller {

  constructor({ type, data = {}, ...rest }) {
    super(rest)
    this.data = data;
    this.type = type;
  }

  @expose @observable type = null;

  @expose @observable data = null;

  @command "resolve"(result) {
    this._promise.resolve(result);
  }

  @command "reject"(result) {
    this._promise.reject(result);
  }
  @command "show"() {
    return new Promise((resolve, reject) => {
      this._promise = { resolve, reject }
    })
  }
}