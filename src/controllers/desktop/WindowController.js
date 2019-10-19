import { observable, action, reaction, computed } from "mobx";
import { Controller } from "../../lib/Controller";
import { getter } from "../../lib/utils";

export const WindowController = Controller(class extends Controller.Store {

  static $id = "wid";

  @getter @observable _proc = null;
  @getter @observable _closed = false;
  @getter @observable _maximized = false;

  constructor({ proc, ...rest }) {
    super(rest);
    this._proc = proc;
  }

  get title() {
    return this._proc.title;
  }

  get state() {
    return this._proc.state;
  }

  static $actions = {
    'rendered': {
      execute({element}) {
        console.log({element});
      }
    },
    'maximize': {
      execute() {
        this._maximized = true;
      }
    },
  }
})

