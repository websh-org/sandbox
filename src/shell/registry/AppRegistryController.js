import { observable, action, reaction, computed, toJS } from "mobx";
import { Controller, expose, command } from "~/lib/controller/Controller";
import { RemoteController } from "../proc/RemoteController";
import { ProcInfo } from "~/lib/ProcInfo";

import knownApps from "~/../static/known.apps.json"
import { parseWebShellURI } from "~/lib/utils";

function checkURL(uri) {
  uri = new URL(uri);
  //if (uri.protocol !== "https:" && uri.hostname!=="localhost") throw {code:"app-not-https"}
  return uri.href;
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
    for (var uri in saved) {
      this._update({uri,manifest:saved[uri]})
    }
  }

  async _save() {
    const saved = {};
    for (var info of this.infos) {
      if (info.unknown) continue;
      saved[info.uri] = info.manifest;
    }
    this.registry("save",{key:"apps",value:saved});
  }

  _get({uri}) {
    const { type, locator } = parseWebShellURI(uri);
    if (!this._infos.has(uri)) {
      this._infos.set(uri,new ProcInfo({uri}))
      this._infos.get(uri).unknown = true;
    }
    return this._infos.get(uri)
  }

  _update({uri,manifest}) {
    const { type, locator } = parseWebShellURI(uri);
    const info = this._get({uri});
    if (!manifest) {
      if (!info.unknown) return;
    } else {
      info.manifest = manifest;
      info.unknown = false;
    }
  }

  @command get({ uri }) {
    return this._get({uri});
  }
  
  @command update({uri,manifest}) {
    if (manifest) {
      this._update({uri,manifest})
      this._save();
    } else {
      this._infos.delete(uri);
    }
  }
};
