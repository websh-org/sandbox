export class FileFormat {
  constructor(id, def) {
//    console.log(toJS(def));
    this.id = id;
    this.name = def.name;
    this.save = !!def.save;
    this.open = !!def.open;
    this.new = !!def.new;
    this.extension = def.extension;
    this.type = def.type;
    this.accept = def.accept || this.extension && "." + this.extension || this.type;
    this.encoding = def.encoding || "text";
  }

  newFile() {
    return {
      name: "New " + this.name + (this.extension ? "." + this.extension : ""),
      format: this.id,
      extension: this.extension,
      type: this.type
    }
  }
}