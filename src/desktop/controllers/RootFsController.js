import { observable, action, when, reaction, computed, toJS } from "mobx";
import { Controller, expose, command } from "../../lib/controller/Controller";

export class RootFsController extends Controller {
  registry = null;
  appRegistry = null;

  @observable _mtab = new Map();

  @computed get mtab() {
    return [...this._ps.values()];
  }

  @command async "fs-mount"({ uri, proc }) {
    this._mtab.add(uri,proc)
  }

  @command async "fs-umount"({ uri }) {
    this._mtab.delete(uri)
  }

};

