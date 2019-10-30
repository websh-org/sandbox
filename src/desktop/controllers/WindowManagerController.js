import { observable, action, when, reaction, computed } from "mobx";
import { Controller, expose, command } from "../../lib/Controller";
import { WindowController } from "./WindowController";

export class WindowManagerController extends Controller {

  @expose @computed 
  get windows() {
    return [...this._windows.values()];
  }

  @observable 
  _windows = new Map();

  async addWindow(window) {
    this._windows.set(window.wid, window);
    return window;
  }

  @command async "window-activate"({ window }) {
    for (const w of this.windows) {
      if (w.active) {
        await w("deactivate")
      }
    }
    if(window) await window("activate");
    this.activeWindow = window;
  }

  @command async "window-close"({ window, confirmed = false }) {
    if (typeof window !== "function") debugger;
    await window("close",{confirmed});
    const sorted = this.windows.concat().sort((a, b) => a.zIndex - b.zIndex);
    //    const sorted = this.windows.concat();
    let index = sorted.findIndex(w => w === window);
    this._windows.delete(window.wid);
    if (!this._windows.length) return;
    if (index >= this.windows.length) index = this.windows.length - 1;
    this.call("window-activate", { window: sorted[index] })
  }

  @command async "window-open"({ proc, ...rest }) {
    return await this.addWindow(
      WindowController.create({ parent: this, proc,...rest })
    );
  }

}
