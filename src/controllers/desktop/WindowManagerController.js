import { observable, action, when, reaction, computed } from "mobx";
import { Controller } from "../../lib/Controller";
import { AppWindowController } from "./AppWindowController";

export const WindowManagerController = Controller(class extends Controller.Store {

  @observable _windows = new Map();

  @computed get windows() {
    return [...this._windows.values()];
  }

  _addWindow(window) {
    this._windows.set(window.wid, window);
    when(
      () => window.closed,
      () => this._windows.delete(window.wid)
    );
    return window;
  }

  static $actions = {
    "open-app": {
      execute({ proc }) {
        return this._addWindow(AppWindowController({ proc }));
      }
    },
    "proc-kill": {
      execute({ pid }) {
        this._proc.get(pid)("kill");
      }
    }
  }
})
