import { observable, action, reaction, computed, toJS } from "mobx";
import { Controller, expose, command } from "~/lib/controller/Controller";
import { RemoteController } from "../proc/RemoteController";
import { AppInfo } from "~/lib/AppInfo";

import knownApps from "~/../static/known.apps.json"

function checkURL(url) {
  url = new URL(url);
  //if (url.protocol !== "https:" && url.hostname!=="localhost") throw {code:"app-not-https"}
  return url.href;
}

export class AppRegistryController extends Controller {

  constructor({registry,...rest}) {
    super(rest);
    this.registry = registry;
    this._load();
  }

 
  @observable 
  _infos = new Map;

  @expose @computed get infos(){
    return [...this._infos.values()];
  }


  async _load() {
    const saved = Object.assign({},knownApps,await this.registry("load",{key:"apps",initial:{}}));
    for (var url in saved) {
      this._update({url,manifest:saved[url]})
    }
  }

  async _save() {
    const saved = {};
    for (var info of this.infos) {
      if (info.unknown) continue;
      saved[info.url] = info.manifest;
    }
    this.registry("save",{key:"apps",value:saved});
  }

  _get({url}) {
    url = checkURL(url);
    if (!this._infos.has(url)) {
      this._infos.set(url,new AppInfo({url}))
      this._infos.get(url).unknown = true;
    }
    return this._infos.get(url)
  }

  _update({url,manifest}) {
    url = checkURL(url);
    const info = this._get({url});
    if (!manifest) {
      if (!info.unknown) return;
    } else {
      info.manifest = manifest;
      info.unknown = false;
    }
  }

  @command get({ url }) {
    return this._get({url});
  }
  
  @command update({url,manifest}) {
    if (manifest) {
      this._update({url,manifest})
      this._save();
    } else {
      this._infos.delete(url);
    }
  }
};
