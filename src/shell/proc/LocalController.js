import { observable, action, reaction, computed } from "mobx";
import { RemoteMasterPort } from "@websh/remote-master-port";

import { Controller, expose, command, state, errors, timeout, promise } from "~/lib/controller/Controller";
import { BaseProcController } from "./BaseProcController";
import { translate } from "~/lib/utils";

export class LocalController extends BaseProcController {

  @expose kind = null;

  constructor({ kind, ...rest }) {
    super({ ...rest });
    this.kind = kind;
  }

  @computed get title() {
    return this.manifest.name;
  }

   getManifest() {
   this.info = {about: {
      name: this.manifest.name
    }}

    return this.manifest;
  }

  loadProc({manifest={}}) {
    console.log(manifest)
    this.manifest = manifest;
  }

  async _close({ confirmed }) {
  }

  async _kill() {
  }

  _activate() {
    //this.element.focus();
  }
  _deactivate() {
  }
};