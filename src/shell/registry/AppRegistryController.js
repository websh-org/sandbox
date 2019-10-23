import { observable, action, reaction, computed, toJS } from "mobx";
import { Controller, internal, command, readonly } from "~/lib/Controller";
import { RemoteController } from "../proc/RemoteController";
import { AppInfo } from "~/lib/AppInfo";

export class AppRegistryController extends Controller {

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
      if (info.unknown) continue;
      saved[info.url] = info.manifest;
    }
    this.registry("save",{key:"apps",value:saved});
  }

  @internal
  _get({url}) {
    if (!this._infos.has(url)) {
      this._infos.set(url,new AppInfo({url}))
      this._infos.get(url).unknown = true;
    }
    return this._infos.get(url)
  }

  @internal
  _update({url,manifest}) {
    this._get({url}).manifest = manifest
    this._infos.get(url).unknown = false;
  }

  @command
  get({ url }) {
    url = new URL(url).href
    return this._get({url});
  }
  
  @command
  update({url,manifest}) {
    url = new URL(url).href
    if (manifest) {
      this._update({url,manifest})
      this._save();
    } else {
      this._infos.delete(url);
    }
  }
};
