import { observable, action, reaction, computed } from "mobx";
import { Controller, readonly, command, internal, state } from "../../lib/Controller";


var maxZ = 0;

export class WindowController extends Controller {

  static $id = "wid";

  @state 
  @observable
  maximized = false;

  @state 
  @observable
  closed = false;

  @state 
  @observable
  active = false;
  

  @state
  @observable
  zIndex = 0;

  @state
  @computed
  get state() {
    return this.proc.state;
  }

  @state
  @computed
  get title() {
    return this.proc.title;
  }

  @state
  @computed
  get icon() {
    return this.info.about.icon;
  }


  @state
  @computed
  get info() {
    return this.proc.info;
  }

  constructor({ proc, ...rest }) {
    super(rest);
    this.proc = proc;
  }

  @internal 
  @observable
  proc = null;

  
  @command
  @action
  "activate"() {
    this.zIndex = ++ maxZ;
    this.active = true;
    this.proc("activate");
  }

  @command
  @action
  "deactivate"() {
    this.proc("deactivate");
    this.active = false;
    return this;
  }

  @command
  "load"({ element }) {
    this.proc("load", { element })
  }

  @command
  "maximize"() {
    this.maximized = true;
  }

  @command
  async "close"({confirmed}={}) {
    await this.proc("close", {confirmed})
    this.closed = true;
  }
}
