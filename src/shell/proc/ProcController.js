import { observable, action, reaction, when, computed } from "mobx";
import { Controller, internal, readonly, command, state } from "../../lib/Controller";

import { resolve } from "dns";
import { ControllerError } from "~/lib/ControllerError";

let counter = 0;

export class ProcController extends Controller {
  element = null;

  static $id = "pid";


  @state
  type = null;

  @state
  @observable
  manifest = {};

  @state
  @observable
  state = null;

  @state
  @observable
  dead = false;

  @observable
  _title = null;

  get title() {
    return this.title;
  }

  constructor({ title, ...rest }) {
    super(rest);
    this._title = title || "p" + (counter++);
    this.INITIAL();
  }

  @action
  INITIAL() {
    this.assert(this.state === null, "unexpected-state", {
      state: this.state,
      expected: null
    }); 
    this.promise("closed");
    this.promise("connect");
    this.promise("load");
    this.state = "INITIAL";
  }


  @action
  async LOADING({ element }) {
    this.assert(this.state === "INITIAL", "unexpected-state", {
      state: this.state,
      expected: "INITIAL"
    });
    this.element = element;
    this.state = "LOADING";
  }

  @action
  async CONNECTING() {
    this.assert(this.state === "LOADING", "unexpected-state", {
      state: this.state,
      expected: "LOADING"
    });
    this.state = "CONNECTING";
    this.resolve("load");
  }

  @action
  async READY() {
    this.state = "READY";
  }

  @action
  async INVALID(error) {
    error = new ControllerError(error);
    this.state = "INVALID";
    this.reject("load",error);
    this.reject("connect",error);
    this.reject("closed",error);
  }

  async DEAD() {
    this.state = "DEAD";
  }


  @command
  async 'load'({ element }) {
    this.LOADING({ element });
  }

  @command
  'kill'() {
    this._dead = true;
  }

  @command
  async 'connect'() {
    await this.await("load","connect");
    return this.manifest;
  }

  

  @command
  async 'ready'() {
    await this.READY();
  }

  @command
  async 'closed'() {
    return this.await("closed");
  }

  _activate() { }

  @command
  async "activate"() {
    await this._activate()
  }

  _deactivate() { }

  @command
  async "deactivate"() {
    await this._deactivate()
  }


  @command
  async "close"({ confirmed = false }) {
    if (this.state!=="READY") return;
    try {
      await this._close({ confirmed });
    } catch (e) {
      if (!confirmed) this.throw(e)
    }
  }

  promises = {};
  promise(name) {
    this.assert(!this.promises[name], "duplicate-promise")
    const promise = new Promise((resolve, reject) => {
      this.promises[name] = { resolve, reject }
    })
    this.promises[name].promise = promise;
  }
  async await(...names) {
    console.log("await", names)
    return (
      await Promise.all(names.map(name=>this.promises[name].promise))
    )
  }
  reject(name, error) {
    this.promises[name].reject(error);
    //delete this.promises[name];
  }
  resolve(name, res) {
    console.log("resolve",name,res)
    this.promises[name].resolve(res);
    //delete this.promises[name];
  }

};
