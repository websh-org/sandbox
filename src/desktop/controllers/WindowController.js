import { observable, action, reaction, computed } from "mobx";
import { Controller, readonly, command, internal } from "../../lib/Controller";
import { getter } from "../../lib/utils";

var maxZ = 0;

export const WindowController = Controller(class extends Controller.Store {

  static $id = "wid";

  @readonly 
  @observable
  maximized = false;

  @readonly 
  @observable
  closed = false;

  @observable
  active = false;
  

  @readonly
  @observable
  zIndex = 0;

  @computed
  get title() {
    return this.proc.title;
  }

  @computed
  get state() {
    return this.proc.state;
  }

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

  @computed
  get icon() {
    return this.info.about.icon;
  }

  @command
  @action
  "activate"() {
    this.zIndex = ++ maxZ;
    this.active = true;
  }

  @command
  @action
  "deactivate"() {
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
  "close"() {
    this.closed = true;
  }
})

