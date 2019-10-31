import { observable, action, when, reaction, computed } from "mobx";

import { Controller, expose, command, errors } from "~/lib/controller/Controller";

import { WindowManagerController } from "./WindowManagerController";
import { ShellController } from "~/shell/ShellController";
import { DialogController } from "./DialogController";
import { MenuItem } from "~/lib/MenuItem";
import { AppWindowController } from "./AppWindowController";
export class DesktopController extends Controller {

  @expose shell = ShellController.create({ parent: this });

  @expose wm = WindowManagerController.create({ parent: this });

  @expose get windows() {
    return this.wm.windows;
  }

  @expose @computed get infos() {
    return this.shell.infos
  }

  constructor({ ...rest }) {
    super({ ...rest });
  }

  toolbars = new WeakMap()

  @expose toolbarFor(window) {
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

  @expose @observable modal = null;


  @observable activeWindow = null;

  @action async showModal(type, data = {}) {
    this.modal = DialogController.create({ type, data });
    const result = await this.modal("show");
    this.modal = null;
    return result;
  }


  async catch(error) {
    console.log('caught')
    if (error.originalError) console.error(error.originalError);
    await this.showModal("error", { error })
  }


  @command async "show-launcher"() {
    const me = this;
    const { uri } = await this.showModal("launcher", { get infos() { return me.infos } }) || {};
    if (!uri) return;
    this.call("window-open", { uri })
  }
  

  @command async "window-activate"({ window }) {
    await this.wm("window-activate", { window });
  }

  @command async "window-close"({ window }) {
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


  @command async "launch-app"({ url }) {
    return await this.call("window-open", { uri:"webshell:app:" + url })
  }

  @command .errors({
      async "app-invalid-manifest"(error) {
        await this.catch(error)
      }
    })
  async "window-open"({ uri, keepOpen, ...rest }) {
    const proc = await this.shell("proc-open", { uri, ...rest })
    const window = await this.wm("window-open", { keepOpen, proc });
    await this.call("window-activate", { window })
    try {
      await this.shell("proc-connect", { proc });

//      await proc("ready");

      if (window.info.file && window.info.file.new) {
        await this.call("app-file-new",{window})
      }

      this.waitForClose({window});
    } catch (error) {
      await this.throw(error);
      await this.call("window-close", { window })
    }
  }

  async waitForClose({window}) {
    try {
      await window.proc("closed");
    } catch (error) {
      await this.catch(error);
      await this.call("window-close", { window })
    }
  }


  @command async "app-file-new"({ window }) {
    return await window.proc("file-new", {})
  }

  @command async "app-file-open"({ window }) {
    const { file, format } = await this.showModal("file-open", { formats:window.info.file.formats }) || {};
    if (!file) return;
    return await window.proc("file-open", { file, format })
  }

  @command async "app-file-save"({ window, format }) {
    const file = await window.proc("file-save", { format });
    await this.showModal("file-save", { file }) || {};
  }

  @command async "app-about"({ window }) {
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
          return !!window.info.file.formats.default;
        },
      }, {
        icon: "open folder",
        label: "Open",
        available(window) {
          return !!window.info.file.formats.open.length;
        },
        params: (window) => ({ window }),
        command: "app-file-open",
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


