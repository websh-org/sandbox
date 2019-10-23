import { observable, action, reaction, when, computed } from "mobx";
import { Controller, internal, readonly, command, state } from "../../lib/Controller";

import { resolve } from "dns";

let counter = 0;

export class ProcController extends Controller {
  static $id = "pid";

  @state
  type = null;

  @state
  @observable
  manifest = {};

  @state
  @observable
  isLoading = true;

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
    const promise = new Promise((resolve, reject) => {
      this._connectedPromise = { resolve, reject }
    })
    this._connectedPromise.promise = promise;
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
      this.assert(false, error)
    }
  }

  @command
  'kill'() {
    this._dead = true;
  }

  @command
  'connect'() {
    return this._connectedPromise.promise;
  }

  _activate() { }

  _deactivate() { }


  @command
  async 'ready'() {
    await this._ready();
    this.state="READY";
  }

  @command
  async "activate"() {
    await this._activate()
  }

  @command
  async "deactivate"() {
    await this._deactivate()
  }

  @command
  async "close"({ confirmed = false }) {
    try {
      await this._close({ confirmed });
    } catch (e) {
      if (!confirmed) this.throw(e)
    }
  }
};
