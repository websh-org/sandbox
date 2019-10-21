import { observable, action, when, reaction, computed } from "mobx";
import { Controller, readonly, internal, command } from "../../lib/Controller";
import { AppWindowController } from "./AppWindowController";

export const WindowManagerController = Controller(class extends Controller.Store {

  @observable _windows = new Map();

  @computed get windows() {
    return [...this._windows.values()];
  }

  @internal
  addWindow(window) {
    this._windows.set(window.wid, window);
    return window;
  }

  @command
  "window-activate"({ window }) {
    for (const w of this.windows) {
      if (w.active) {
        w("deactivate")
      }
    }
    window("activate");
    this.activeWindow = window;
  }

  @command
  async "window-close"({ window }) {
    await window("close");
    const sorted = this.windows.concat().sort((a,b)=>a.zIndex-b.zIndex);
//    const sorted = this.windows.concat();
    let index = sorted.findIndex( w => w===window);
    this._windows.delete(window.wid)
    if (index >= this.windows.length) index = this.windows.length-1;
    this.action("window-activate",{window:sorted[index]})
  }

  @command 
  @action
  "open-app"({ proc }) {
    return this.addWindow(
      AppWindowController({ parent: this, proc })
    );
  }

})
