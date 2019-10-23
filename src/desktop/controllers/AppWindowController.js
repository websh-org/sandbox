/**
 * The toolbar should move to DesktopController
 */

import { observable, action, reaction, computed } from "mobx";
import { Controller, readonly, command, state } from "~/lib/Controller";
import { WindowController } from "./WindowController"
import { MenuItem } from "~/lib/MenuItem"

export class AppWindowController extends WindowController {

  @state
  @readonly
  toolbar = new MenuItem(AppToolbar, this);

  @state
  @computed
  get file() {
    return this.proc.file;
  }

  @command
  async "file-new"({ format }) {
    return await this.proc("file-new", { format })
  }

  @command
  async "file-open"({ file, format }) {
    return await this.proc("file-open", { file, format })
  }

  @command
  async "file-save"({ format }) {
    return await this.proc("file-save", { format })
  }
}


const AppToolbar = {
  items: [
    {
      type: "group",
      available() {
        return this.info.file.supported;
      },
      items: [{
        icon: "file",
        label: "New",
        available() {
          return !!this.info.file.formats.new.length;
        },
          items() {
          return this.proc.info.file.formats.new.map(f => ({
            label: f.label || f.title || f.id,
            execute() {
              this._trigger("app-action", { action: "file-new", params: { format: f.id } });
            }
          }))
        },
      }, {
        icon: "open folder",
        label: "Open",
        available() {
          return !!this.info.file.formats.open.length;
        },
        items() {
          return this.proc.info.file.formats.open.map(f => ({
            label: f.label || f.title || f.id,
            execute() {
              this._trigger("app-action", { action: "file-open", params: { format: f.id } });
            }
          }))
        },
      },
      {
        icon: "save",
        label: "Save",
        available() {
          console.log("format",this.file && this.file.format)
          return this.file && !!this.info.file.formats.save.length;
        },
        items() {
          return this.proc.info.file.formats.save.map(f => ({
            label: f.label || f.title || f.id,
            execute() {
              this._trigger("app-action", { action: "file-save", params: { format: f.id } });
            }
          }))
        },
      },
      ]
    },
    {
      icon: "info",
      label: "About",
      execute() {
        this._trigger("app-action", { action: "about" });
      }
    }
  ]
}



