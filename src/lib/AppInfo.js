import { observable, action, reaction, computed, toJS } from "mobx";
import licenses from 'spdx-license-list';

import { ControllerError } from "./controller/ControllerError"
import { translate, invalidator } from "~/lib/utils";

import manifestSchema from "~/../static/schemas/app-manifest.json";
import { FileFormat } from "./FileFormat";
import { FileApiInfo } from "~/api/app/file/fileApiInfo";
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
        console.log({errors,value:toJS(value)})
        throw new ControllerError({ code: "app-invalid-manifest", data: { errors, url: this.url } })
      }
      this._manifest = value;

  }

  constructor({ url, manifest }) {
  //  if (!url) debugger
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
    return new FileApiInfo(this.manifest||{});
  }
}
