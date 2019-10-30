import { observable, action, reaction, computed } from "mobx";
import { RemoteMasterPort } from "@websh/remote-master-port";

import { Controller, expose, command, state, errors, timeout, promise } from "/lib/Controller";
import { WebController } from "./WebController";
import { translate } from "~/lib/utils";

translate({
  "error:port-connect-timeout": "The app failed to connect",
  "error:port-connect-timeout:message": "This is probably not a valid WebShell app.",
  "error:remote-navigated": "Unexpected navigation in app",
  "error:remote-navigated:message": "This is possibly a bug in the app, unless you accidentally reloaded the iframe.",
})

export class RemoteController extends WebController {

  _masterPort = null;

 
  async getManifest() {
    const origin = this.element.sandbox && !this.element.sandbox.contains("allow-same-origin") ? "*" : this.origin;
    this._masterPort = new RemoteMasterPort('SOUTH-TOOTH', this.element, { origin });
    try {
      return await this._masterPort.connect();
    } catch (error) {
      this.throw({code:error.message})
    }
  }

  iframeNavigated() {
    this.setState("INVALID",{error:{code:"remote-navigated"}});
  }
  
  async _close({ confirmed }) {
    return await this.request("proc-close", { confirmed });
  }

  async _kill() {
    this.element.removeAttribute('src');
    this.element.srcdoc = "Not loaded";
    await this._masterPort.disconnect();
    this.url = null;
  }

 
  send(...args) {
    return this._masterPort.send(...args);
  }

  @errors({
    async "command-failed"(error) {
      await this.throw(error);
    }
  })
  async request(...args) {
    try {
      if (!this._masterPort) debugger;
      const res = await this._masterPort.request(...args);
      return res;
    } catch ({ error: code, data }) {
      console.log("remote error",{code,data})
      return await this.throw({ code, data })
    }
  }
};