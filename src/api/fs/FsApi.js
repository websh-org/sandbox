import { observable, action, reaction, computed, toJS } from "mobx";
import { ControllerApi, expose, command } from "~/lib/controller/Controller";
import { ShellFile } from "~/lib/ShellFile";
import { translate } from "~/lib/utils";

translate({
  "error:fs-not-found": "File not found",
  "error:fs-not-found": "File not found.",
})

export class FsApi extends ControllerApi {

  @command async "fs-list"({fid}) {
    const res = await this.fsList({fid});
    return res;
  }

  @command async "fs-read"({fid}) {
    const res = await this.fsRead({fid});
    return res;
  }
  async fsList({fid}) {
    this.throw("not-implemented");
  }
  async fsRead({fid}) {
    this.throw("not-implemented");
  }
}

export class RemoteFsApi extends FsApi {

  fsList({fid}) {
    return this.controller.request("fs-list", {fid});
  }
  
  fsRead({ fid }) {
    return this.controller.request("fs-get", { fid });
  }
}