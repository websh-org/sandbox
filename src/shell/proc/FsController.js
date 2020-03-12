import { observable, action, reaction, computed, toJS } from "mobx";
import { expose, command } from "~/lib/controller/Controller";
import { RemoteController } from "./RemoteController";
import { RemoteFsApi } from "~/api/fs/FsApi";

export class FsController extends RemoteController {
  constructor(params) {
    super(params);
    this._api.set('fs', RemoteFsApi.create({ controller: this }))
    this.on("fs-mounted",action((data)=>{
      this.user = data.user;
      this.mounted = true;
    }))
    this.on("fs-unmounted",action((data)=>{
      this.user = null;
      this.mounted = false;
    }))
  }



  @expose @computed get extra() {
    return this.user;
  }

  @observable mounted = false;
  @observable user = null;

  @action RELOADING() { 
    this.setState("CONNECTING");
  }
};
