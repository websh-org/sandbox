import { observable, action, reaction, computed } from "mobx";
import { Controller, expose, command } from "~/lib/controller/Controller";
import { WindowController } from "./WindowController"
import { MenuItem } from "~/lib/MenuItem"

export class AppWindowController extends WindowController {

  @expose @computed 
  get file() {
    return this.proc.file;
  } 

  @command async "file-new"({ format }) {
    debugger;
    await this.proc("file-new", { format })
    this.fileFormat = format;
  }

  @command async "file-open"({ file, format }) {
    return await this.proc("file-open", { file, format })
  }

  @command async "file-save"({ format }) {
    return await this.proc("file-save", { format })
  }
}
