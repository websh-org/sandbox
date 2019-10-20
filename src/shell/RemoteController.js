import { observable, action, reaction, computed } from "mobx";
import { Controller, readonly, command, internal } from "/lib/Controller";
import { ProcController } from "./ProcController";
import { getter } from "/lib/utils";
import { RemoteMasterPort } from "@websh/remote-master-port";

export const RemoteController = Controller(class AppStore extends ProcController.Store {
  @readonly
  @observable
  url;

  @readonly
  @observable
  state = "INITIAL";



  constructor({ url, ...rest }) {
    const parsed = new URL(url);
    super({ ...rest });
    this.url = parsed.href;
    this.origin = parsed.origin;
  }

  @internal
  iframe = null;

  async _load({ element }) {
    this.iframe = element;
    this._masterPort = new RemoteMasterPort('SOUTH-TOOTH', element, { origin: this.origin });
    await this._loadApp();
  }

  _loadApp() {
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

  _connected() {

  }

  send(...args) {
    return this._masterPort.send(...args);
  }
  async request(...args) {
    const res = await this._masterPort.request(...args);
    console.log('req', ...args, { res });
    return res;
  }

});
