import { observable, action, reaction, computed } from "mobx";
import { Controller } from "/lib/Controller";
import { ProcController } from "./ProcController";
import { getter } from "/lib/utils";
import { RemoteMasterPort } from "@websh/remote-master-port";

export const RemoteController = Controller( class AppStore extends ProcController.Store {
  @getter @observable _url;
  @getter @observable _state="INITIAL";
  @getter @observable _manifest={};
  
  _iframe = null;
  
  constructor({ url, ...rest }) {
    const parsed = new URL(url);
    super({...rest});
    this._url = parsed.href;
    this._origin = parsed.origin;
  }

  _mounted({element}) {
    this._iframe = element;
    this._masterPort = new RemoteMasterPort('SOUTH-TOOTH', element, { origin: this.origin});
    this._load();
  }

  _load() {
    const iframe = this._iframe;
    const timeout = setTimeout(
      () => {
        this._state="INVALID";
        this.assert(false,"app-load-timeout");
      },
      10000
    );
    iframe.onerror = err => {
      clearTimeout(timeout);
      console.log('error',err)
    }
    iframe.onload = async () => {
      clearTimeout(timeout);
      this._state = "LOADED";
      this._iframe.onload = null;
      this._connect();
    }
    iframe.src = this._url;
  }

  async _connect() {
    const timeout = setTimeout(
      () => {
        this._state="INVALID";
        this.assert(false,"app-load-timeout");
      },
      5000
    );
    try {
      this._manifest = await this._masterPort.connect();
      clearTimeout(timeout);
      this._state = "CONNECTED";
    } catch (err) {
      console.log(err);
      clearTimeout(timeout);
      //await this.unload();
      this._state = "INVALID";
    }
  }

  send(...args) {
    return this._masterPort.send(...args);
  }
  async request(...args) {
    const res = await this._masterPort.request(...args);
    console.log('req',...args,{res});
    return res;
  }

});
