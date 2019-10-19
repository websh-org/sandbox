import { observable, action, reaction, computed, toJS } from "mobx";

export class AppInfo {
  
  manifest = null;
  url = null;
  constructor({url,manifest}) {
    this.url = url;
    if (manifest) this.manifest = manifest;
    else this.manifest={api:{}}
  }

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

