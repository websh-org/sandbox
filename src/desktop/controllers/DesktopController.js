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
      var toolbar = {};
      switch (window.proc.type) {
        case "app":
          toolbar = AppToolbar;
          break;
        default:
          toolbar = {};
      }
      this.toolbars.set(window, new MenuItem(toolbar, this, window));
    }
    return this.toolbars.get(window);
  }

  @state
  @observable
  modal = null;


  @observable
  activeWindow = null;

  @action
  async showModal(type, data = {}) {
    this.modal = DialogController.create({ type, data });
    const result = await this.modal("show");
    this.modal = null;
    return result;
  }


  async catch(error) {
    if (error.originalError) console.error(error.originalError);
    await this.showModal("error", { error })
  }


  @command
  async "show-launcher"() {
    const me = this;
    const { url } = await this.showModal("launcher", { get infos() { return me.infos } }) || {};
    if (!url) return;
    this.call("launch-app", { url })
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
            await this.call("app-file-save", { window, format: window.file.format })
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
  async "launch-proc"({ type, ...rest }) {
    const proc = await this.shell("proc-open", { type, ...rest })
    const window = await this.wm("window-open", { type, proc });
    await this.call("window-activate", { window })
    try {
      await this.shell("proc-connect", { proc });
      await proc("closed");
    } catch (error) {
      //await this.catch(error);
      //this.call("window-close", { window })
      this.throw(error)
    }
  }

  @command
  async "launch-app"({ url }) {
    return await this.call("launch-proc", { type: "app", url })
  }

  @command
  async "app-file-new"({ window }) {
    return await window.proc("file-new", {})
  }

  @command
  async "app-file-open"({ window, format }) {
    const formatInfo = window.info.file.formats.get(format);
    const { file } = await this.showModal("file-open", { format: formatInfo }) || {};
    if (!file) return;
    return window.proc("file-open", { file, format })
  }

  @command
  async "app-file-save"({ window, format }) {
    const file = await window.proc("file-save", { format });
    await this.showModal("file-save", { file }) || {};
  }

  @command
  async "app-about"({ window }) {
    await this.showModal("app-about", { about: window.info.about }) || {};
  }
}



const AppToolbar = {
  items: [
    {
      type: "group",
      available(window) {
        return window.info.file.supported;
      },
      items: [{
        icon: "file",
        label: "New",
        command: "app-file-new",
        params: (window) => ({ window }),
        available(window) {
          return !!window.info.file.formats.new.length;
        },
      }, {
        icon: "open folder",
        label: "Open",
        available(window) {
          return !!window.info.file.formats.open.length;
        },
        items(window) {
          return window.info.file.formats.open.map(f => ({
            label: f.label || f.id,
            execute(window) {
              this.call("app-file-open", { window, format: f.id });
            }
          }))
        },
      },
      {
        icon: "save",
        label: "Save",
        available(window) {
          return window && !!window.info.file.formats.save.length;
        },
        items(window) {
          return window.info.file.formats.save.map(f => ({
            label: f.label || f.title || f.id,
            execute() {
              this.call("app-file-save", { window, format: f.id });
            }
          }))
        },
      },
      ]
    },
    {
      icon: "info",
      label: "About",
      execute(window) {
        this.call("app-about", { window });
      }
    }
  ]
}


