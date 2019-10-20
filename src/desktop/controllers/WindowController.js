import { observable, action, reaction, computed } from "mobx";
import { Controller, readonly, command } from "../../lib/Controller";
import { getter } from "../../lib/utils";

export const WindowController = Controller(class extends Controller.Store {
 
  static $id = "wid";

  constructor({ proc, ...rest }) {
    super(rest);
    this.proc = proc;
  }

  @readonly 
  @observable
  proc = null;

  @readonly 
  @observable
  closed = false;

  @readonly 
  @observable
  maximized = false;

  @computed
  get title() {
    return this.proc.title;
  }

  @computed
  get state() {
    return this.proc.state;
  }

  @command
  'rendered'({ element }) {
    console.log({ element });
  }

  @command
  'maximize'() {
    this.maximized = true;
  }
})

