import { observable, action, reaction, computed } from "mobx";
import { RemoteMasterPort } from "@websh/remote-master-port";

import { Controller, expose, command, state, errors, timeout, promise } from "~/lib/controller/Controller";
import { BaseProcController } from "./BaseProcController";
import { translate } from "~/lib/utils";

export class LocalController extends BaseProcController {

  @expose kind = null;

  constructor({ kind, type, ...rest }) {
    super({ type, ...rest });
    this.kind = this.locator;
  }

  @expose @computed get title() {
    return this.info.about.name;
  }

  getManifest() {
    return this.element && this.element.manifest;
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