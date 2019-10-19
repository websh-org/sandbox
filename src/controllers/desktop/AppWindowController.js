import { observable, action, reaction, computed } from "mobx";
import { Controller } from "~/lib/Controller";
import { getter } from "~/lib/utils";
import { WindowController } from "./WindowController"
import { MenuItem } from "~/lib/MenuItem"

export const AppWindowController = Controller(class extends WindowController.Store {
  toolbar = new MenuItem(AppToolbar,this);
  static $actions = {
    "mounted": {
      execute({ element }) {
        this.proc("mounted", { element })
      }
    }
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
            this._trigger("app-action",{action:"file-new",params:{format:f.id}});
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
            this._trigger("app-action",{action:"file-open",params:{format:f.id}});
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
            this._trigger("app-action",{action:"file-save",params:{format:f.id}});
          }
        }))
      },
    }
  ]
}




const DialogController = Controller(class DialogStore extends Controller.Store {

  @getter @observable _data = null;

  static $actions = {
    "resolve": {
      execute(result) {
        this._resolve(result);
      },
    },
    "reject": {
      execute(result) {
        this._reject(result);
      }
    },
    "open": {
      execute(data) {
        this._data = data;
        return new Promise((resolve,reject)=>{
          this._resolve = resolve;
          this._reject = reject;
        })
      }
    }
  }
})