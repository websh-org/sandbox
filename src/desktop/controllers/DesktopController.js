import { observable, action, when, reaction, computed } from "mobx";

import { Controller, readonly, internal, command, state } from "~/lib/Controller";

import { WindowManagerController } from "./WindowManagerController";
import { ShellController } from "~/shell/ShellController";
import { DialogController } from "./DialogController";
export class DesktopController extends Controller {

  @state
  shell = ShellController.create({ parent: this });

  @state
  wm = WindowManagerController.create({ parent: this });

  @state
  get windows() {
    return this.wm.windows;
  }

  @state
  @computed
  get infos() {
    return this.shell.infos
  }

  constructor({ ...rest }) {
    super({ ...rest });
    this.on("app-action", ({ target: app }, { action, params }) => {
      this.call("app-" + action, { ...params, app });
    })
  }

  @state
  @state
  @observable
  modal = null;

  @internal
  @action
  async showModal(type, data = {}) {
    this.modal = DialogController.create({ type, data });
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
    this.call("launch-app", { url })
  }

  @internal
  async catch(error) {
    console.error(error);
    if(error.originalError) console.error(error.originalError);
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
            await this.call("app-file-save",{app:window,format:window.file.format})
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
      const proc = await this.shell("app-open", { url })
      const window = await this.wm("open-app", { proc });
      this.call("window-activate", { window })
      try {
        await this.shell("app-connect",{proc});
        const def = proc.info.file
        if (def.supported && def.formats.default) {
          this.call("app-file-new",{app:proc,format:def.formats.default.id})
        }
      } catch (error) {
        await this.catch(error);
        this.call("window-close",{window})
      }
  
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
}

