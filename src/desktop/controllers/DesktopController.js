import { observable, action, when, reaction, computed } from "mobx";

import { getter } from "~/lib/utils";

import { Controller, readonly, internal, command } from "~/lib/Controller";

import { WindowManagerController } from "./WindowManagerController";
import { ShellController } from "~/shell/ShellController";
import { DialogController } from "./DialogController";

export const DesktopController = Controller(class DesktopStore extends Controller.Store {

  @readonly
  shell = ShellController({ parent: this });

  @readonly
  wm = WindowManagerController({ parent: this });

  get windows() {
    return this.wm.windows;
  }

  @computed
  get infos() {
    return this.shell.infos
  }

  constructor({ ...rest }) {
    super({ ...rest });
    this.on("app-action", ({ target: app }, { action, params }) => {
      this.action("app-" + action, { ...params, app });
    })
  }

  @readonly
  @observable modal = null;

  @internal
  async showModal(type, data = {}) {
    this.modal = new DialogController({ type, data });
    const result = await this.modal("show");
    this.modal = null;
    return result;
  }

  @command
  async "show-launcher"() {
    const me = this;
    const { url } = await this.showModal("launcher", { get infos() { return me.infos } }) || {};
    if (!url) return;
    this.action("launch-app", { url })
  }

  @command
  async "launch-app"({ url }) {
    const proc = await this.shell("init-app", { url })
    const window = this.wm("open-app", { proc });
  }

  @command
  "app-file-new"({ app, format }) {
    return app.proc("file-new", { format })
  }

  @command
  async "app-file-open"({ app, format }) {
    const { file } = await this.showModal("file-open") || {};
    if (!file) return;
    return app.proc("file-open", { file, format })
  }

  @command
  async "app-file-save"({ app, format }) {
    const file = await app.proc("file-save", { format });
    await this.showModal("file-save", { file }) || {};
  }

  @command
  async "app-about"({ app }) {
    await this.showModal("app-about", { about: app.proc.info.about }) || {};
  }
})

