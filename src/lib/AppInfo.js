import { observable, action, reaction, computed, toJS } from "mobx";

function resolveURL(from,to) {
  if (!to) return null;
  try {
    const url = new URL(to,from);
    return url.href;
  } catch(error) {
    console.log(error)
    return null;
  }
}

export class AppInfo {
  url = null;

  @observable
  manifest = null;

  constructor({url,manifest}) {
    this.url = url;
    if (manifest) this.manifest = manifest;
    else this.manifest={api:{}}
  }
  
  @computed
  get about() {
    return {
      name: this.manifest.name,
      icon: resolveURL(this.url,this.manifest.icon),
      description: this.manifest.description
    }
  }

  @computed
  get file() {
    const def = this.manifest.api && this.manifest.api.file; 
    const ret = {
      supported: !!def,
      formats: {
        all: [],
        new: [],
        open: [],
        save: [],
      }
    }
    if (!ret.supported) return ret;
    const formats = def.formats;
    ret.formats.all = Object.keys(formats).map(id=>({
      ...formats[id],
      id
    }))
    
    ret.formats.new = ret.formats.all.filter(f=>f.new);
    ret.formats.open = ret.formats.all.filter(f=>f.open);
    ret.formats.save = ret.formats.all.filter(f=>f.save);
    return ret;
  }
}

