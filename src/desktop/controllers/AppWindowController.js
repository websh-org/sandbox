import { observable, action, reaction, computed } from "mobx";
import { Controller, readonly, command } from "~/lib/Controller";
import { WindowController } from "./WindowController"
import { MenuItem } from "~/lib/MenuItem"

export const AppWindowController = Controller(class extends WindowController.Store {
  @readonly
  toolbar = new MenuItem(AppToolbar, this);

  @computed
  get icon() {
    return this.proc.info.about.icon;
  }

  @command
  "load"({ element }) {
    this.proc("load", { element })
  }
})


const AppToolbar = {
  items: [
    {
      icon: "file",
      label: "New",
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
      items() {
        return this.proc.info.file.formats.save.map(f => ({
          label: f.label || f.title || f.id,
          execute() {
            this._trigger("app-action", { action: "file-save", params: { format: f.id } });
          }
        }))
      },
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



