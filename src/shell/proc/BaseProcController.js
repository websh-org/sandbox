import { observable, action, reaction, when, computed } from "mobx";
import { Controller, expose, command } from "../../lib/controller/Controller";

import { resolve } from "dns";
import { ControllerError } from "~/lib/controller/ControllerError";

let counter = 0;

export class BaseProcController extends Controller {
  static $id = "pid";

  @expose type = null;
  @expose @observable manifest = null;
  @expose @observable info
  @expose @observable state = null;
  @expose @observable dead = false;
  
  @observable _api = new Map();

  @expose @computed get api() {
    const ret = {};
    for (const key of this._api.keys()) {
      ret[key] = this._api.get(key);
    }
    return ret;
  }

  @expose @computed get uri () {
    return "webshell:"+this.type+":"+this.locator;
  }

  @expose get title() {
    return this._title;
  }

  @observable _title = null;

  element = null;

  constructor({ title, type, locator, info, ...rest }) {
    super(rest);
    this.type = type;
    this.info = info;
    this.locator = locator;
    if (!info) debugger;
    //this._title = title || "p" + (counter++);
    this.promise("loaded");
    this.promise("connected");
    this.promise("closed");
    this.setState("INITIAL");
  }

  states = {
    INITIAL: {
      enter: () => { },
      from: null
    },
    LOADING: {
      from: "INITIAL",
    },
    CONNECTING: {
      from: "LOADING",
    },
    CONNECTED: {
      from: "CONNECTING",
    },
    READY: {
      from: "CONNECTED"
    },
    INVALID: {

    }
  }

  async setState(STATE, data = {}) {
    //console.log(this.state,"-->",STATE)
    if (STATE === "INVALID") {
      this.state = "INVALID";
      this.INVALID({ ...data, state: this.state });
      return;
    }
    const state = this.states[STATE];
    try {
      this.assert(state, "proc-unknown-state", { state: STATE });
      this.assert(!("from" in state) || this.state === state.from, "proc-unexpected-state", { state: STATE, from: this.state });
      this.state = STATE;
      this[STATE] && await this[STATE](data);
      return;
    } catch (error) {
      await this.setState("INVALID", { error })
    }

  }

  @action INITIAL() { }

  loadProc() { }

  @action async LOADING({ element, ...rest }) {
    this.element = element;
    await this.loadProc(rest);
    this.setState("CONNECTING");
  }

  @action async CONNECTING() {
    this.resolve("loaded");
    const manifest = this.manifest = await this.getManifest();
    this.setState("CONNECTED", { manifest });
  }

  async getManifest() {
    return null;
  }

  @action async CONNECTED({ manifest }) {
    this.manifest = manifest;
    this.resolve("connected");
  }

  @action async READY() {
  }

  @action async INVALID({ error, state }) {
    //console.log({state,error})
    error = new ControllerError(error);
    this.reject("loaded", error);
    this.reject("connected", error);
    this.reject("closed", error);
  }

  async DEAD() {
    this.state = "DEAD";
  }


  @command async 'load'({ ...params }) {

    this.setState("LOADING", params );
  }

  @command 'kill'() {
    this._dead = true;
  }

  @command async 'connect'() {
    await this.await("loaded", "connected");
    return this.manifest;
  }



  @command async 'ready'() {
    await this.setState("READY");
  }

  @command async 'closed'() {
    return this.await("loaded", "connected", "closed");
  }

  _activate() { }

  @command async "activate"() {
    await this._activate()
  }

  _deactivate() { }

  @command async "deactivate"() {
    await this._deactivate()
  }


  @command async "close"({ confirmed = false }) {
    if (this.state !== "READY") return;
    try {
      await this._close({ confirmed });
    } catch (e) {
      if (!confirmed) this.throw(e)
    }
  }

  promises = {};
  promise(name) {
    this.assert(!this.promises[name], "duplicate-promise")
    const p = this.promises[name] = {};
    const promise = new Promise((resolve, reject) => {
      Object.assign(p, { resolve, reject, count: 0, committed: false })
    })
    p.promise = promise;
  }

  commit(name) {
    this.promises[name].commited = true;
  }
  async await(...names) {
    await Promise.all(
      names.map(async name => {
        this.promises[name].committed = true;
        return this.promises[name].promise
      })
    )
  }

  reject(name, error) {
    const p = this.promises[name];
    console.log(name)
    if (p.committed) p.reject(error);
  }
  resolve(name, res) {
    this.promises[name].resolve(res);
  }
};
