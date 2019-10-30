import { observable, action, when, reaction, computed } from "mobx";
import { Controller, expose, command } from "../lib/Controller";
import { ProcController } from "./proc/ProcController";
import { AppRegistryController } from "./registry/AppRegistryController";

import { RegistryController } from "./registry/RegistryController"

import knownApps from "~/../static/known.apps.json"

export class ShellController extends Controller {
  registry = null;
  appRegistry = null;

  @observable _ps = new Map();

  @computed get ps() {
    return [...this._ps.values()];
  }

  @expose @computed get infos() {
    return this.appRegistry.infos;
  }

  config = {
    registry : {
      storage: "local-storage",
    }
  }

  registry = RegistryController.create(this.config.registry);
  appRegistry = AppRegistryController.create({ registry: this.registry });
  

  @command async "proc-open"({ type, ...rest }) {
    const info = await this.registry_getProcInfo({ type, ...rest });
    const proc = await this.addProc(ProcController.create({ type, info, ...rest }));
    return proc;
  }

  @command async "proc-connect"({ proc }) {
    try {
      await proc("connect");
      await this.registry_updateProcInfo({ proc });
      await proc("ready");
      return proc;
    } catch (error) {
      await this.registry_resetProcInfo({ proc });
      this.throw(error);
    }
  }

  addProc(proc) {
    this._ps.set(proc.pid, proc);
    when(
      () => proc.dead,
      () => this._ps.delete(proc.pid)
    );
    return proc;
  }

  async registry_getProcInfo({ type, ...rest }) {
    switch (type) {
      case "app":
        const { url } = rest;
        return await this.appRegistry("get", { url });
      default:
        return { about: {} };
    }
  }

  async registry_updateProcInfo({ proc }) {
    const { manifest, type } = proc;
    switch (type) {
      case "app":
        const { url } = proc;
        return await this.appRegistry("update", { url, manifest });
      default:
        return { about: {} };
    }
  }

  async registry_resetProcInfo({ proc }) {
    const { manifest, type } = proc;
    switch (type) {
      case "app":
        const { url } = proc;
        return await this.appRegistry("update", { url, manifest: null });
      default:
        return { about: {} };
    }
  }

};

