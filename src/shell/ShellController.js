import { observable, action, when, reaction, computed, toJS } from "mobx";
import { Controller, expose, command } from "../lib/controller/Controller";
import { ProcController } from "./ProcController";
import { AppRegistryController } from "./registry/AppRegistryController";

import { RegistryController } from "./registry/RegistryController"

import knownApps from "~/../static/known.apps.json"
import { ProcInfo } from "~/lib/ProcInfo";
import { parseWebShellURI } from "~/lib/utils";

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
    registry: {
      storage: "local-storage",
    }
  }

  registry = RegistryController.create(this.config.registry);
  appRegistry = AppRegistryController.create({ registry: this.registry });


  @command async "proc-open"({ uri, ...rest }) {
    const { type, locator } = parseWebShellURI(uri);
    const info = await this.appRegistry("get", { uri });
    const proc = await this.addProc(ProcController.create({ uri, info, ...rest }));
    return proc;
  }

  @command async "proc-connect"({ proc }) {
    try {
      await proc("connect");
      await this.appRegistry("update", { uri: proc.uri, manifest: proc.manifest });
      await proc("ready");
      return proc;
    } catch (error) {
      await this.appRegistry("update", { uri: proc, manifest: null });
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
};

