import { observable, action, reaction, computed } from "mobx";
import { Controller } from "../../lib/Controller";
import { getter } from "../../lib/utils";
import { resolve } from "dns";

let counter = 0;

export const ProcController = Controller(class ProcStore extends Controller.Store {

  static $id = "pid";

  @getter @observable _dead = false;
  @getter @observable _title = null;

  constructor({ title, ...rest }) {
    super(rest);
    this._title = title || "p" + (counter++);
  }

  _mounted({element}) {
  }

  static $actions = {
    'mounted': {
      execute({element}) {
        this._mounted({element});
      }
    },
    'kill': {
      execute() {
        this._dead = true;
      }
    }
  }
});
