import { observable, action, reaction, computed } from "mobx";
import { Controller, readonly, command, state } from "~/lib/Controller";
import { WindowController } from "./WindowController"
import { MenuItem } from "~/lib/MenuItem"

export class AppWindowController extends WindowController {

  @state
  @observable 
  file = null;

  @state
  @observable 
  fileFormat = null;

  @command
  async "file-new"({ format }) {
    await this.proc("file-new", { format })
    this.fileFormat = format;
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
