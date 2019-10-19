import { observable, action, reaction, computed } from "mobx";
import { Controller } from "~/lib/Controller";
import { getter } from "~/lib/utils";

export const DialogController = Controller(class DialogStore extends Controller.Store {

  constructor({type,data={},...rest}) {
    super(rest)
    this._data = data;
    this._type = type;
  }

  @getter @observable _type = null;

  @getter @observable _data = null;

  static $actions = {
    "resolve": {
      execute(result) {
        this._resolve(result);
      },
    },
    "reject": {
      execute(result) {
        this._reject(result);
      }
    },
    "ask": {
      execute(data) {
        return new Promise((resolve,reject)=>{
          this._resolve = resolve;
          this._reject = reject;
        })
      }
    }
  }
})