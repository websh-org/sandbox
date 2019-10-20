import { observable, action, when, reaction, computed } from "mobx";
import { Controller, readonly, command, internal } from "../lib/Controller";
import { ProcController } from "./ProcController";
import { AppRegistryController } from "./registry/AppRegistryController";
import { AppController } from "./AppController";

import { RegistryController } from "./registry/RegistryController"

export const ShellController = Controller(class ShellStore extends Controller.Store {

  constructor({
    registry = {
      storage: "local-storage",
    },
    ...rest
  }) {
    super(rest);
    this.registry = RegistryController(registry)
    this.appRegistry = AppRegistryController({ registry: this.registry });
  }

  @internal
  registry = null;

  @internal
  appRegistry = null;

  @observable
  _ps = new Map();

  @computed
  get ps() {
    return [...this._ps.values()];
  }

  @computed
  get infos() {
    return this.appRegistry.infos;
  }

  @internal
  addProc(proc) {
    this._ps.set(proc.pid, proc);
    when(
      () => proc.dead,
      () => this._ps.delete(proc.pid)
    );
    return proc;
  }

  @command
  async "init-app"({ url }) {
    const info = await this.appRegistry("get", { url });
    const app = this.addProc(AppController({ url, info }));
    app("connect").then(async manifest => {
      await this.appRegistry("update", { url, manifest })
      await app("init");
    })
    return app;
  }

  @command
  "proc-kill"({ pid }) {
    this._ps.get(pid)("kill");
  }
});

