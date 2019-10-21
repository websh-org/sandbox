import { observable, action, reaction, computed, toJS } from "mobx";
import { Controller, internal, command, readonly } from "~/lib/Controller";
import { RemoteController } from "../RemoteController";
import { getter } from "~/lib/utils";
import { AppInfo } from "~/lib/AppInfo";

export const AppRegistryController = Controller(class AppRegistryStore extends Controller.Store {

  constructor({registry,...rest}) {
    super(rest);
    this.registry = registry;
    this._load();
  }


  @internal 
  @observable 
  _infos = new Map;

  @computed get infos(){
    return [...this._infos.values()];
  }


  @internal
  async _load() {
    const saved = await this.registry("load",{key:"apps",initial:{}});
    for (var url in saved) {
      this._update({url,manifest:saved[url]})
    }
  }

  @internal
  async _save() {
    const saved = {};
    for (var info of this.infos) {
      saved[info.url] = info.manifest;
    }
    this.registry("save",{key:"apps",value:saved});
  }

  @internal
  _get({url}) {
    if (!this._infos.has(url)) {
      this._infos.set(url,new AppInfo({url}))
    }
    return this._infos.get(url)
  }

  @internal
  _update({url,manifest}) {
    this._get({url}).manifest = manifest
  }

  @command
  get({ url }) {
    return this._get({url});
  }
  
  @command
  update({url,manifest}) {
    this._update({url,manifest})
    this._save();
  }
});
