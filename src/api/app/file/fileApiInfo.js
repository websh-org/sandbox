import { computed, observable } from "mobx";
import { FileFormat } from "~/lib/FileFormat";



export class FileApiInfo {
  constructor(manifest = {}) {
    this.def = manifest.api && manifest.api.file;
  }

  @computed get supported() {
    return !!this.def
  }

  @computed get formats() {
    return new FileFormatsInfo(this.def);
  }

  @computed get save() {
    return this.formats.save.map(({ id }) => id);
  }

  @computed get open() {
    return this.formats.open.map(({ id }) => id);
  }

  @computed get new() {
    return this.formats.default;
  }

  @computed
  get defaultNewFile() {
    return this.formats.default && this.formats.default.newFile()
  }
}

class FileFormatsInfo {
  @observable def={};
  constructor(def={}) {
    this.def = def;
  }

  @computed get _formats() {
    const ret = {};
    for (var id in this.def.formats) {
      ret[id] = new FileFormat(id, this.def.formats[id]);
    }
    return ret;
  }

  get(id) {
    return this._formats[id]
  }

  @computed get all() {
    return Object.values(this._formats);
  }

  @computed get open() {
    return this.all.filter(({ id }) => this.def.open && this.def.open.includes(id));
  }

  @computed get save() {
    return this.all.filter(({ id }) => this.def.save && this.def.save.includes(id));
  }

  @computed get default() {
    return this.all.find(({ id }) => this.def.new && this.def.new === id);
  }

}