import { observable, action, when, reaction, computed } from "mobx";

import { Controller, command, state, errors } from "~/lib/Controller";

import { WindowManagerController } from "./WindowManagerController";
import { ShellController } from "~/shell/ShellController";
import { DialogController } from "./DialogController";
import { MenuItem } from "~/lib/MenuItem";
import { AppWindowController } from "./AppWindowController";
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

  toolbars = new WeakMap()

  @state 
  toolbarFor(window) {
    if (!this.toolbars.has(window)) {
      //if (window.Store === AppWindowController) 
        this.toolbars.set(window,new MenuItem(AppToolbar,this,window));
      //else this.toolbars.set(window,new MenuItem({},this));
    } 
    return this.toolbars.get(window);
  }

  @state
  @observable
  modal = null;

  @action
  async showModal(type, data = {}) {
    this.modal = DialogController.create({ type, data });
    const result = await this.modal("show");
    this.modal = null;
    return result;
  }

  @observable
  activeWindow = null;

  @command
  async "show-launcher"() {
    const me = this;
    const { url } = await this.showModal("launcher", { get infos() { return me.infos } }) || {};
    if (!url) return;
    this.call("launch-app", { url })
  }

  async catch(error) {
    if (error.originalError) console.error(error.originalError);
    await this.showModal("error", { error })
  }

  /**
   * 
   * WINDOW COMMANDS
   *
   */


  @command
  async "window-activate"({ window }) {
    await this.wm("window-activate", { window });
  }

  @command
  async "window-close"({ window }) {
    try {
      await this.wm("window-close", { window });
    } catch (e) {
      switch (e.error) {
        case "file-unsaved":
          const res = await this.showModal("file-unsaved", {})
          if (!res) return;
          if (res.save) {
            await this.call("app-file-save", { app: window, format: window.file.format })
          }
      }
      await this.wm("window-close", { window, confirmed: true });
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
    .errors({
      async "app-invalid-manifest"(error) {
        await this.catch(error)
      }
    })
  async "launch-app"({ url }) {
    const proc = await this.shell("app-open", { url })
    const window = await this.wm("open-app", { proc });
    await this.call("window-activate", { window })
    try {
      const res = await this.shell("app-connect", { proc });
      // TODO: Should this be here? Probably not
      const def = proc.info.file
      if (def.supported && def.formats.default) {
        await this.call("app-file-new", { app: proc, format: def.formats.default.id })
      }

      await proc("closed");
      console.log("closed")
    } catch (error) {
      //await this.catch(error);
      this.call("window-close", { window })
      this.throw(error)
    }

  }

  @command
  async "app-file-new"({ app, format }) {
    return await app("file-new", { format })
  }

  @command
  async "app-file-open"({ app, format }) {
    const formatInfo = app.info.file.formats.get(format);
    const { file } = await this.showModal("file-open", { format: formatInfo }) || {};
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



const AppToolbar = {
  items: [
    {
      type: "group",
      available(app) {
        return app.info.file.supported;
      },
      items: [{
        icon: "file",
        label: "New",
        available(app) {
          return !!app.info.file.formats.new.length;
        },
        items(app) {
          return app.info.file.formats.new.map(f => ({
            label: f.label || f.id,
            execute() {
              this.call("app-file-new", { app, format: f.id });
            }
          }))
        },
      }, {
        icon: "open folder",
        label: "Open",
        available(app) {
          return !!app.info.file.formats.open.length;
        },
        items(app) {
          return app.info.file.formats.open.map(f => ({
            label: f.label || f.id,
            execute(app) {
              this.call("app-file-open", { app, format: f.id });
            }
          }))
        },
      },
      {
        icon: "save",
        label: "Save",
        available(app) {
          return app.file && !!app.info.file.formats.save.length;
        },
        items(app) {
          return app.info.file.formats.save.map(f => ({
            label: f.label || f.title || f.id,
            execute() {
              this.call("app-file-save", { app, format: f.id });
            }
          }))
        },
      },
      ]
    },
    {
      icon: "info",
      label: "About",
      execute(app) {
        this.call("app-about", { app });
      }
    }
  ]
}


