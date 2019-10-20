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
    when(
      () => window.closed,
      () => this._windows.delete(window.wid)
    );
    return window;
  }

  @command 
  "open-app"({ proc }) {
    return this.addWindow(
      AppWindowController({ parent: this, proc })
    );
  }

})
