import { FileFormat } from "~/lib/FileFormat";

export function fileApiInfo(manifest) {
  const def = manifest.api && manifest.api.file;
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