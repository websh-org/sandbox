import { observable, action, reaction, computed } from "mobx";
import { RemoteMasterPort } from "@websh/remote-master-port";

import { Controller, command, state, errors, timeout, promise } from "/lib/Controller";
import { ProcController } from "./ProcController";
import { translate } from "~/lib/utils";

translate({
  "error:app-load-unreachable": "The app is unreachable",
  "error:app-load-unreachable:message": "The app url cannot be reached.",
  "error:app-load-timeout": "The app failed to load",
  "error:app-load-timeout:message": "The app took too long to load.",
  "error:remote-connect-timeout": "The app failed to connect",
  "error:remote-connect-timeout:message": "This is probably not a valid WebShell app.",
})

export class RemoteController extends ProcController {

  constructor({ url, ...rest }) {
    super({ ...rest });

    const parsed = new URL(url);
    this.url = parsed.href;
    this.origin = parsed.origin;
  }

  _masterPort = null;

  @state
  @observable
  url;

  send(...args) {
    return this._masterPort.send(...args);
  }


  @action
  async INITIAL() {
    await super.INITIAL()
  }

  @action
  async LOADING({element,...rest}) {
    this.assert(element instanceof HTMLIFrameElement, "bad-mount-point")
    super.LOADING({element,...rest});

    try {
      const origin = element.sandbox && !element.sandbox.contains("allow-same-origin") ? "*" : this.origin;
      this._masterPort = new RemoteMasterPort('SOUTH-TOOTH', element, { origin });
      await this.checkAvailable();
      await this.loadIframe();
      this.resolve("load");
      this.CONNECTING();
    } catch (error) {
      this.INVALID({code:"app-load-fail"});
    }
  }

  async CONNECTING() {
    await super.CONNECTING();
    try {
      const manifest = await this._masterPort.connect();
      this.state = "CONNECTED";
      this.manifest = manifest;
      this.resolve("connect",manifest);
    } catch (error) {
      this.INVALID(error)
    }
  }

  @timeout(5000, "app-load-timeout")
  async checkAvailable() {
    await fetch(this.url, {
      method: "head",
      cache: "no-cache"
    })
  }

  @timeout(5000, "app-load-timeout")
  @promise
  async loadIframe(resolve) {
    const { element: iframe } = this
    iframe.onload = e => {
      clearTimeout(timeout);
      this.element.onload = ()=>this.INVALID({code:"double-load"});
      resolve();
      //this._connect();
    }
    iframe.src = this.url;
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

  _activate() {
    this.element.focus();
    this.element.contentWindow.focus();
    //this.send("proc-activate");
  }
  _deactivate() {
    //this.send("proc-deactivate");
  }


  @errors({
    "command-failed"(error) {
      this.throw(error);
    }
  })
  async request(...args) {
    try {
      if (!this._masterPort) debugger;
      const res = await this._masterPort.request(...args);
      return res;
    } catch ({ error: code, message, data }) {
      this.throw({ code, message, data })
    }
  }
};