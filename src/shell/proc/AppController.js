import { observable, action, reaction, computed, toJS } from "mobx";
import { Controller, internal, command, readonly, state } from "~/lib/Controller";
import { RemoteController } from "./RemoteController";
import { ShellFile } from "~/lib/ShellFile";

export class AppController extends RemoteController {

  constructor({info,...rest}) {
    super(rest);
    this.info = info;
  }

  @state
  type = "app";

  @state
  @observable
  file = null

  @state
  @observable 
  info

  @state
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
    this.assert(this.info.file.supported, "not-supported");
    const formatInfo = this.info.file.formats.get(format);
    const { extension, type } = file;
    console.log("opening",formatInfo,{format,extension,type})
    const content = await file.getContent({encoding:formatInfo.encoding});
    const res = await this.request("file-open", { format, content, extension, type });
    this.file = file;
    return res;
  }
  
  @command
  async "file-save"({ format }) {
    this.assert(this.info.file.supported, "not-supported");
    const res = await this.request("file-save", { format });
    const { content, type } = res;
    this.file.setContent({content,type});
    console.log("app",this.file)
    return this.file;
  }

  async _ready() {
  
  }
};
