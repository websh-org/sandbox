import { observable, action, reaction, computed, toJS } from "mobx";
import { Controller, internal, command, readonly } from "~/lib/Controller";
import { RemoteController } from "./RemoteController";
import { getter } from "~/lib/utils";
import { ShellFile } from "~/lib/ShellFile";

export const AppController = Controller(class AppStore extends RemoteController.Store {

  constructor({info,...rest}) {
    super(rest);
    this.info = info;
  }

  @readonly
  @observable
  file = null

  @readonly
  @observable 
  info

  @computed
  get title() {
    return (
      this.info.about.name || this.url
    )
  }

  @command
  async "file-new"({ format }) {
    this.assert(this.info.file.supported, "not-supported");
    const file = new ShellFile(this.info.file.newFile({format}));
    const res = await this.request("file-new", { format });
    this.file = file;
    return res;

  }

  @command
  async "file-open"({ file, format }) {
    const { extension, type } = file;
    const content = await file.getContent();
    const res = await this.request("file-open", { format, content, extension, type });
    this.file = file;
    return res;
  }
  
  @command
  async "file-save"({ format }) {
    const res = await this.request("file-save", { format });
    const { content, type } = res;
    this.file.setContent({content,type});
    console.log("app",this.file)
    return this.file;
  }

  async _init() {
    const def = this.info.file
    if (def.supported && def.formats.default) {
      this.action("file-new",{format:def.formats.default.id})
    }
  }
});
