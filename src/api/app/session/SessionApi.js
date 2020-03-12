import { observable, action, reaction, computed, toJS } from "mobx";
import { ControllerApi, expose, command } from "~/lib/controller/Controller";
import { ShellFile } from "~/lib/ShellFile";
import { translate } from "~/lib/utils";

translate({
  "error:file-cannot-open": "Cannot open file",
  "error:file-cannot-open:message": "The app failed to open the file: {reason}",
})

export class FileApi extends ControllerApi {

  @expose @observable currentFile;
  @expose @observable currentFormat;

  @command async "file-new"({}) {
    const {target} = this;
    this.assert(target.info.file.supported, "not-supported");
    const file = new ShellFile(target.info.file.defaultNewFile);
    const res = await this.fileNew({});
    this.currentFile = file;
    return res;
  }

  @command async "file-open"({ file, format }) {
    const {target} = this;
    this.assert(target.info.file.supported, "not-supported");
    const formatInfo = target.info.file.formats.get(format);
    const { extension, type } = file;
    const content = await file.getContent({encoding:formatInfo.encoding});
    const res = await this.fileOpen({ format, content, extension, type });
    this.currentFile = file;
    return res;
  }

  @command async "file-save"({ format }) {
    const {target} = this;
    this.assert(target.info.file.supported, "not-supported");
    const res = await this.fileSave({ format });
    const { content, type } = res;
    this.currentFile.setContent({content,type});
    return this.currentFile;
  }

  async fileNew({}) {
    this.throw("not-implemented");
  }
  
  async fileOpen({ format, content, extension, type }) {
    this.throw("not-implemented");
  }
  
  async fileSave({format}) {
    this.throw("not-implemented");
  }
}

export class RemoteFileApi extends FileApi {

  fileNew({}) {
    return this.target.request("file-new", { });
  }
  
  fileOpen({ format, content, extension, type }) {
    return this.target.request("file-open", { format, content, extension, type });
  }
  fileSave({format}) {
    return this.target.request("file-save", { format });
  }
}