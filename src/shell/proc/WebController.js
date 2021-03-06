import { observable, action, reaction, computed } from "mobx";
import { RemoteMasterPort } from "@websh/remote-master-port";

import { Controller, expose, command, state, errors, timeout, promise } from "~/lib/controller/Controller";
import { BaseProcController } from "./BaseProcController";
import { translate } from "~/lib/utils";

translate({
  "error:app-load-unreachable": "The app is unreachable",
  "error:app-load-unreachable:message": "The app's URL cannot be reached.",
  "error:app-load-timeout": "The app failed to load",
  "error:app-load-timeout:message": "The app took too long to load.",
})

export class WebController extends BaseProcController {

  constructor({ ...rest }) {
    super({ ...rest });

    const parsed = new URL(this.locator);
    this.origin = parsed.origin;
  }

  _masterPort = null;

  @expose @computed get title() {
    return this._title || this.locator;
  }

  send(...args) {
    return this._masterPort.send(...args);
  }

  @action async loadProc() {
    const element = this.element;
    await this.checkAvailable();
    await this.loadIframe();
    const origin = element.sandbox && !element.sandbox.contains("allow-same-origin") ? "*" : this.origin;
    this._masterPort = new RemoteMasterPort('SOUTH-TOOTH', element, { origin });
  }

  @timeout(5000, "app-load-timeout")
  async checkAvailable() {
    try {
      await fetch(this.locator, {
        method: "head",
        mode: "no-cors",
        cache: "no-cache"
      })
    } catch (error) {
      this.throw("app-load-unreachable", { url: this.locator, reason: String(error) })
    }
  }

  iframeNavigated() {

  }

  @timeout(5000, "app-load-timeout")
  @promise async loadIframe(resolve) {
    const { element: iframe } = this

    iframe.onload = e => {
      this.element.onload = this.iframeNavigated.bind(this);
      resolve();
      //this._connect();
    }
    iframe.src = this.locator;
  }

  async _close({ confirmed }) {
    return await this.request("proc-close", { confirmed });
  }

  async _kill() {
    this.element.removeAttribute('src');
    this.element.srcdoc = "Not loaded";
    await this._masterPort.disconnect();
    this.locator = null;
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