import { observable, action, reaction, when, computed } from "mobx";
import { Controller, internal, readonly, command } from "../lib/Controller";
import { getter } from "../lib/utils";
import { resolve } from "dns";

let counter = 0;

export const ProcController = Controller(class ProcStore extends Controller.Store {
  static $id = "pid";

  @readonly @observable
  manifest = {};

  @readonly @observable
  isLoading = true;

  @readonly @observable
  dead = false;

  @internal @observable 
  _title = null;

  get title() {
    return this.title;
  }


  constructor({ title, ...rest }) {
    super(rest);
    this._title = title || "p" + (counter++);
  }

  _load({ element }) {
  }

  _ready() {
  }

  _close() {
  }


  @command
  async 'load'({ element }) {
    try {
      await this._load({ element });
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      this.assert(false,error)
    }
  }

  @command
  'kill'() {
    this._dead = true;
  }

  @command
  'connect'() {
    return new Promise((resolve,reject) => {
      when(
        () => !this.isLoading,
        () => this.dead ? reject() : resolve(this.manifest)
      )
    })    
  }

  @command
  'ready'() {
    return this._ready();
  }

  @command
  async "close" ({confirmed=false}) {
    try {
      await this._close({confirmed});
    } catch (e) {
       if (!confirmed) this.throw(e)
    }
  }
});
