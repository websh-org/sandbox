import { observable, action, reaction, computed, toJS } from "mobx";
import licenses from 'spdx-license-list';

import { ControllerError } from "./ControllerError"
import { invalidator } from "~/lib/utils";

import manifestSchema from "~/../static/schemas/app-manifest.json";
const invalidate = invalidator(manifestSchema);


function resolveURL(...args) {
  try {
    const url = new URL(...args);
    return url.href;
  } catch (error) {
    console.log("bad url",...args)
    return null;
  }
}

export class AppInfo {

  url = null;

  @observable
  _manifest = null;

  get manifest() {
    return this._manifest;
  }

  set manifest(value) {
    const errors = invalidate(value);
    if (errors) {
      throw new ControllerError({code:"app-invalid-manifest",data:{errors}})
    }
    if (!invalidate(value)) this._manifest=value;
  }

  constructor({ url, manifest }) {
    if(!url) debugger
    this.url = url;
    if (manifest) this.manifest = manifest;
  }

  @computed
  get about() {
    if (!this.manifest) return {supported:false};
    const { name, icon, description, license, homepage, repository } = this.manifest;
    return {
      name,
      description,
      icon: resolveURL(icon, this.url),
      homepage: resolveURL(homepage),
      repository: resolveURL(repository),
      license: licenses[license] || {
        name: "Unspecified",
        url: null,
        osiApproved: false
      }
    }
  }

  @computed
  get file() {
    const def = this.manifest && this.manifest.api && this.manifest.api.file;
    const formats = {};
    const ret = {
      supported: !!def,
      formats: {
        get(id) {
          return formats[id];
        },
        all: [],
        new: [],
        open: [],
        save: [],
        default: null
      },
      defaultNewFile() {
        return ret.formats.default && ret.formats.default.newFile()
      },
      newFile({format,...rest}) {
        return formats[format].newFile(rest)
      }
    }
    if (!ret.supported) return ret;

    for (var id in def.formats) {
      const f = def.formats[id]
      const format = new FileFormat(id, f);
      formats[id] = format;
      ret.formats.all.push(format);
    }

    ret.formats.new = ret.formats.all.filter(f => f.new);
    ret.formats.open = ret.formats.all.filter(f => f.open);
    ret.formats.save = ret.formats.all.filter(f => f.save);
    ret.formats.default = ret.formats.new[0];
  
    return ret;
  }
}

class FileFormat {
  constructor(id, def) {
    this.id = id;
    this.label = def.title || def.label;
    this.save = !!def.save;
    this.open = !!def.open;
    this.new = !!def.new;
    this.extensions = (def.extension || "").trim().split(/\s+/);
    this.extension = this.extensions[0];
    this.types = (def.type || "").trim().split(/\s+/);
    this.type = this.types[0];
    this.encoding = def.encoding || "text"
  }

  newFile() {
    if (!this.new) return null;
    return {
      name: "New " + this.label + (this.extension ? "." + this.extension : ""),
      format: this.id,
      extension: this.extension,
      type: this.type
    }
  }
}