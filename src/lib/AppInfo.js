import { observable, action, reaction, computed, toJS } from "mobx";
import licenses from 'spdx-license-list';

import { ControllerError } from "./controller/ControllerError"
import { translate, invalidator } from "~/lib/utils";

import manifestSchema from "~/../static/schemas/app-manifest.json";
import { FileFormat } from "./FileFormat";
import { fileApiInfo } from "~/api/app/file/fileApiInfo";
const invalidate = invalidator(manifestSchema);

translate({
  "error:app-invalid-manifest": "Invalid app manifest",
  "error:app-invalid-manifest:message": "The manifest prestented by the app at {url} failed to validate.",
})


function resolveURL(...args) {
  try {
    const url = new URL(...args);
    return url.href;
  } catch (error) {
    console.log("bad url", ...args)
    return null;
  }
}

export class AppInfo {

  url = null;

  @observable _manifest = null;

  get manifest() {
    return this._manifest;
  }

  set manifest(value) {
    const errors = invalidate(value);
    if (errors) {
      throw new ControllerError({ code: "app-invalid-manifest", data: { errors, url: this.url } })
    }
    if (!invalidate(value)) this._manifest = value;
  }

  constructor({ url, manifest }) {
    if (!url) debugger
    this.url = url;
    if (manifest) this.manifest = manifest;
  }

  @computed get about() {
    if (!this.manifest) return { supported: false };
    const { name, short_name, icon, description, license, homepage, repository, version } = this.manifest;
    return {
      name,
      version,
      description,
      short_name: short_name || name,
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
    return fileApiInfo(this.manifest||{});
    const def = this.manifest && this.manifest.api && this.manifest.api.file;
    const formats = {};
    const ret = {
      supported: !!def,
      new: null,
      save: [],
      open: [],
      formats: {
        get(id) {
          return formats[id];
        },
        all: [],
        open: [],
        save: [],
        default: null
      },
      get defaultNewFile() {
        return ret.formats.default && ret.formats.default.newFile()
      },
      newFile({ format, ...rest }) {
        return formats[format].newFile(rest)
      }
    }
    if (!ret.supported) return ret;

    /**
     * TODO : THROW ERRORS;
     */

    if (def.new in def.formats) {
      ret.new = def.new;
    }

    for (var id in def.formats) {
      const f = def.formats[id]
      const format = new FileFormat(id, f);
      formats[id] = format;
      ret.formats.all.push(format);
      if (def.open && def.open.includes(id)) {
        ret.open.push(id)
        ret.formats.open.push(format);
      }
      if (def.save && def.save.includes(id)) {
        ret.save.push(id)
        ret.formats.save.push(format);
      }
    }
       
    ret.formats.open = ret.formats.all.filter(f => ret.open.includes(f.id));
    ret.formats.save = ret.formats.all.filter(f => ret.save.includes(f.id));
    ret.formats.default = def.new && ret.formats.get(def.new);

    return ret;
  }
}
