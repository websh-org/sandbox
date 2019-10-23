import { observable, action, reaction, computed } from "mobx";
import { Controller, readonly, command, internal, state } from "/lib/Controller";
import { ProcController } from "./ProcController";
import { RemoteMasterPort } from "@websh/remote-master-port";
import { errors } from "~/lib/Controller";

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

  @state
  @observable
  state = "INITIAL";

  iframe = null;

  send(...args) {
    return this._masterPort.send(...args);
  }

  @errors({
    "command-failed"(error) {
      console.log("app-failed")
      this.throw(error);
    }
  })
  async request(...args) {
    try {
      if (!this._masterPort) debugger;
      const res = await this._masterPort.request(...args);
      return res;
    } catch ({error:code,message,data}) {
      this.throw({code,message,data})
    }
  }

  _load({ element: iframe }) {


    this.assert(iframe instanceof HTMLIFrameElement, "bad-mount-point")
    this.iframe = iframe;
    const origin = iframe.sandbox && !iframe.sandbox.contains("allow-same-origin") ? "*" : this.origin;
    this._masterPort = new RemoteMasterPort('SOUTH-TOOTH', iframe, { origin });

    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(this.url, {
          method:"head"
        })
        //console.log(res.headers);
      } catch (error) {
        this._connectedPromise.reject({
          code:"app-load-fail",
          message:"The supplied URL is either unreachable or not allowed in iframes."
        });
      }


      const iframe = this.iframe;
      const timeout = setTimeout(
        () => {
          this.state = "INVALID";
          this._connectedPromise.reject({code:"app-connect-timeout"});
        },
        10000
      );

      iframe.onload = async (e) => {
        clearTimeout(timeout);
        this.state = "LOADED";
        this.iframe.onload = null;
        this._connectedPromise.resolve(await this._connect());
      }
      iframe.src = this.url;
    })
  }

  _connect() {
    return new Promise(async (resolve,reject)=>{

    const timeout = setTimeout(
      () => {
        this.state = "INVALID";
        this._connectedPromise.reject({
          code:"app-connect-timeout",
          message:"The app failed to connect. It's probably not a valid WebShell App."
        });
      },
      2000
    );
    try {
      const manifest = await this._masterPort.connect();
      clearTimeout(timeout);
      this.state = "CONNECTED";
      this.manifest = manifest;
      resolve(manifest);
    } catch (err) {
      clearTimeout(timeout);
      this.state = "INVALID";
      this._connectedPromise.reject(err);
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

  _activate() {
    this.iframe.focus();
    this.iframe.contentWindow.focus();
    //this.send("proc-activate");
  }
  _deactivate() {
    //this.send("proc-deactivate");
  }
};
