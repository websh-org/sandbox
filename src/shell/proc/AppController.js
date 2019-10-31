import { observable, action, reaction, computed, toJS } from "mobx";
import { expose, command } from "~/lib/controller/Controller";
import { RemoteController } from "./RemoteController";
import { RemoteFileApi } from "~/api/app/file/FileApi";

export class AppController extends RemoteController {

  constructor(params) {
    super(params);
    this._api.set('file', RemoteFileApi.create({ target: this }))
  }

  @expose @computed get title() {
    return this.info.about.name || this.url
  }
};
