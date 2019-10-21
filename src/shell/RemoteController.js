import { observable, action, reaction, computed } from "mobx";
import { Controller, readonly, command, internal } from "/lib/Controller";
import { ProcController } from "./ProcController";
import { getter } from "/lib/utils";
import { RemoteMasterPort } from "@websh/remote-master-port";

export const RemoteController = Controller(class AppStore extends ProcController.Store {

  constructor({ url, ...rest }) {
    super({ ...rest });

    const parsed = new URL(url);
    this.url = parsed.href;
    this.origin = parsed.origin;
  }

  @readonly @observable
  url;

  @readonly @observable
  state = "INITIAL";

  @internal
  iframe = null;

  @internal
  send(...args) {
    return this._masterPort.send(...args);
  }

  @internal
  async request(...args) {
    try {
      const res = await this._masterPort.request(...args);
      return res;
    } catch ({error,data}) {
      this.throw(error,data)
    }
  }

  _load({ element: iframe }) {
    this.assert(iframe instanceof HTMLIFrameElement, "bad-mount-point")
    this.iframe = iframe;
    const origin = iframe.sandbox && !iframe.sandbox.contains("allow-same-origin") ? "*" : this.origin
    this._masterPort = new RemoteMasterPort('SOUTH-TOOTH', iframe, { origin });

    return new Promise(async (resolve, reject) => {

      const iframe = this.iframe;
      const timeout = setTimeout(
        () => {
          this.state = "INVALID";
          this.assert(false, "app-load-timeout");
        },
        10000
      );

      iframe.onload = async () => {
        clearTimeout(timeout);
        this.state = "LOADED";
        this.iframe.onload = null;
        resolve(await this._connect());
      }
      iframe.src = this.url;
    })
  }

  _connect() {
    return new Promise(async (resolve,reject)=>{

    const timeout = setTimeout(
      () => {
        this.state = "INVALID";
        this.assert(false, "app-load-timeout");
      },
      5000
    );
    try {
      const manifest = await this._masterPort.connect();
      clearTimeout(timeout);
      this.state = "CONNECTED";
      resolve();
      this.manifest = manifest;
    } catch (err) {
      clearTimeout(timeout);
      //await this.unload();
      this.state = "INVALID";
      resolve();
    }
  })
}

  async _close({confirmed}) {
     return await this.request("proc-close",{confirmed});
  }

  async _kill() {
    this.iframe.removeAttribute('src');
    this.iframe.srcdoc = "Not loaded";
    await this._masterPort.disconnect();
    this.url = null;
    this.STATE = INITIAL;
  }
});
