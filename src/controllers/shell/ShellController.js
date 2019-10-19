import { observable, action, when, reaction, computed } from "mobx";
import { Controller } from "../../lib/Controller";
import { ProcController } from "./ProcController";
import { AppController } from "./AppController";

export const ShellController = Controller(class ShellStore extends Controller.Store {
  @observable _ps = new Map();

  @computed get ps() {
    return [...this._ps.values()];
  }

  _addProc(proc) {
    this._ps.set(proc.pid, proc);
    when(
      () => proc.dead,
      () => this._ps.delete(proc.pid)
    );
    return proc;
  }

  static $actions = {
    "init-app": {
      execute({ url }) {
        return this._addProc(AppController({ url }));
      },
    },
    "proc-kill": {
      execute({ pid }) {
        this._proc.get(pid)("kill");
      }
    }
  }
});

