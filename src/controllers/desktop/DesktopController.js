import { observable, action, when, reaction, computed } from "mobx";

import { getter } from "~/lib/utils";

import { Controller } from "~/lib/Controller";

import { WindowManagerController } from "./WindowManagerController";
import { ShellController } from "~/controllers/shell/ShellController";
import { DialogController } from "./DialogController";

export const DesktopController = Controller(class DesktopStore extends Controller.Store {

  shell = ShellController();
  wm = WindowManagerController();

  @getter @observable _modal = null;

  get windows() {
    return this.wm.windows;
  }

  async _modalAsk(type, data = {}) {
    this._modal = new DialogController({ type, data });
    const result = await this._modal("ask");
    this._modal = null;
    return result;
  }

  static $actions = {
    "launch-app": {
      execute({ url }) {
        const proc = this.shell("init-app", { url })
        const window = this.wm("open-app", { proc });
        window.on("app-action", ({ target }, { action, params }) => {
          this.assert(target.proc === proc)
          this.action("app-" + action, { ...params, proc });
        })
      }
    },
    "app-file-new": {
      execute({ proc, format }) {
        return proc("file-new", { format })
      }
    },
    "app-file-open": {
      async execute({ proc, format }) {
        const { file } = await this._modalAsk("file-open") || {};
        if (!file) return;
        return proc("file-open", { file, format })
      }
    },
    "app-file-save": {
      async execute({ proc, format }) {
        const file = await proc("file-save", { format });
        await this._modalAsk("file-save",{file}) || {};
      }
    },
  }
})
