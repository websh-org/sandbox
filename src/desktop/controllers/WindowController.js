import { observable, action, reaction, computed } from "mobx";
import { Controller, expose, command } from "../../lib/controller/Controller";
import unknownProc from "~/../assets/icons/proc/unknown.svg"

var maxZ = 0;

export class WindowController extends Controller {

  static $id = "wid";

  @expose 
  @observable maximized = false;

  @expose 
  @observable closed = false;

  @expose 
  @observable active = false;
  

  @expose @observable zIndex = 0;

  @expose @computed get state() {
    return this.proc.state;
  }

  @expose @observable keepOpen = false;
  
  @expose @computed get title() {
    return this.info.about ? this.info.about.short_name : this.proc.title;
  }

  @expose @computed get type() {
    return this.proc.type;
  }


  @expose @computed get icon() {
    return this.info.about.icon || unknownProc;
  }


  @expose @computed get info() {
    return this.proc.info;
  }

  constructor({ proc, keepOpen, ...rest }) {
    super(rest);
    this.keepOpen = keepOpen
    this.proc = proc;
  }

  @expose @observable proc = null;
  
  @command @action "activate"() {
    this.zIndex = ++ maxZ;
    this.active = true;
    this.proc("activate");
  }

  @command @action "deactivate"() {
    this.proc("deactivate");
    this.active = false;
    return this;
  }

  @command "load"({ element, ...rest }) {
    this.proc("load", { element, ...rest })
  }

  @command "maximize"() {
    this.maximized = true;
  }

  @command async "close"({confirmed}={}) {
    await this.proc("close", {confirmed})
    this.closed = true;
  }
}
