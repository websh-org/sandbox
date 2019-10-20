import { observable, action, reaction, computed } from "mobx";
import { Controller, internal, command, readonly } from "~/lib/Controller";
import { RemoteController } from "./RemoteController";
import { getter } from "~/lib/utils";

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
    return await this.request("file-new", { format });
  }

  @command
  async "file-open"({ file, format }) {
    const { content, extension, type } = file;
    this.file = file;
    return await this.request("file-open", { format, content, extension, type });
  }
  
  @command
  async "file-save"({ format }) {
    const res = await this.request("file-save", { format });
    const { content, type } = res;
    return Object.assign({}, this.file, { content, type });
  }

  @action
  _init() {
    if (this.info.file.supported) {
      const format = this.info.file.formats.new[0];
      if (format) {
        this.file = {
          format: format.id,
          name: "New " + format.title
        }
      }
    }
  }
});
