import { observable, action, when, reaction, computed } from "mobx";
import { Controller, readonly, command, internal,state } from "../lib/Controller";
import { procTypes } from "./proc";
import { AppRegistryController } from "./registry/AppRegistryController";
import { AppController } from "./proc/AppController";

import { RegistryController } from "./registry/RegistryController"

import knownApps from "~/../static/known.apps.json"

export class ShellController extends Controller {

  constructor({
    registry = {
      storage: "local-storage",
    },
    ...rest
  }) {
    super(rest);
    this.registry = RegistryController.create(registry)
    this.appRegistry = AppRegistryController.create({ registry: this.registry });
  }

  registry = null;

  appRegistry = null;

  @observable
  _ps = new Map();

  @computed
  get ps() {
    return [...this._ps.values()];
  }

  @state
  @computed
  get infos() {
    return this.appRegistry.infos;
  }

  addProc(proc) {
    this._ps.set(proc.pid, proc);
    when(
      () => proc.dead,
      () => this._ps.delete(proc.pid)
    );
    return proc;
  }

  @command
  async "app-open"({ url }) {
    const info = await this.appRegistry("get", { url });
    const proc = await this.addProc(AppController.create({ url, info }));
    return proc;
  }

  @command
  async "app-connect"({ proc }) {
    try {
      const manifest = await proc("connect");
      await this.appRegistry("update", { url:proc.url, manifest })
      await proc("ready");
      return proc;
    } catch (error) {
      console.log('caught?')
      await this.appRegistry("update", { url:proc.url, manifest:null })
      this.throw(error);
    }
  }


  @command
  "proc-kill"({ pid }) {
    this._ps.get(pid)("kill");
  }
 
};

