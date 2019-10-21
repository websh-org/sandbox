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
  @action
  async showModal(type, data = {}) {
    this.modal = new DialogController({ type, data });
    const result = await this.modal("show");
    this.modal = null;
    return result;
  }

  @internal
  @observable
  activeWindow = null;

  @command
  async "show-launcher"() {
    const me = this;
    const { url } = await this.showModal("launcher", { get infos() { return me.infos } }) || {};
    if (!url) return;
    this.action("launch-app", { url })
  }

  @internal
  async catch(error) {
    console.error(error);
    console.log(error.code,error.source)
    await this.showModal("error",{error})
  }

  /**
   * 
   * WINDOW COMMANDS
   *
   */


  @command
  async "window-activate"({ window }) {
    await this.wm("window-activate",{window});
  }

  @command
  async "window-close"({ window }) {
    try {
      await this.wm("window-close",{window});
    } catch(e) {
      switch (e.error) {
        case "file-unsaved": 
          const res = await this.showModal("file-unsaved",{})
          if (!res) return;
          if (res.save) {
            await this.action("app-file-save",{app:window,format:window.file.format})
          }
      }
      await this.wm("window-close",{window,confirmed:true});
      return;
      //this.throw(e);
    }
  }

  /**
   * 
   * APP COMMANDS
   *
   */

  @command
  async "launch-app"({ url }) {
    const proc = await this.shell("ready-app", { url })
    const window = await this.wm("open-app", { proc });
    this.action("window-activate", { window })
  }

  @command
  async "app-file-new"({ app, format }) {
    return await app("file-new", { format })
  }

  @command
  async "app-file-open"({ app, format }) {
    const formatInfo = app.info.file.formats.get(format);
    const { file } = await this.showModal("file-open",{format:formatInfo}) || {};
    if (!file) return;
    return app("file-open", { file, format })
  }

  @command
  async "app-file-save"({ app, format }) {
    const file = await app("file-save", { format });
    await this.showModal("file-save", { file }) || {};
  }

  @command
  async "app-about"({ app }) {
    await this.showModal("app-about", { about: app.info.about }) || {};
  }
})

