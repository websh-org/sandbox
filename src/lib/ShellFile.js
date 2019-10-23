import { observable } from "mobx"

export class ShellFile  {
  static async fromLocal(local) {
    const { name, type, lastModified: mtime } = local;
    const content = await cloneBlob(local);
    const file = new ShellFile({ path: "local/file", name, type, mtime, encoding: "blob", content })
    return file;
  }

  @observable name;

  constructor({ path, name, type, mtime, content, encoding = "text" }) {
    Object.assign(this, { path, name, type, mtime });
    if (content) this.setContent({ content, type, encoding });
  }

  get extension() {
    return this.name.split(".").pop();
  }

  get size() {
    return this.content && this.content.size;
  }

  //TODO: Add b64, json, dataurl, objecturl?

  async setContent({ content, encoding = "text", type = this.type }) {
    switch (encoding) {
      case 'blob': 
      //TODO: What about type?
        this.content = content.slice();
      case 'binary':
      case 'text':
        this.type = type;
        this.content = new Blob([].concat(content), { type });
        break;
    }
  }
  async getContent({ encoding = "text" }={}) {
    if (!this.content) return null;
    switch (encoding) {
      case 'binary':
        return await (new Response(this.content)).arrayBuffer();
      case 'text':
        return await (new Response(this.content)).text();
      case 'blob':
        return this.content._slice();
      case 'dataurl': 
        return new Promise(resolve=>{
          var a = new FileReader();
          a.onload = function(e) {resolve(e.target.result);}
          a.readAsDataURL(this.content);
        })
      }
}
}

function createObjectURL({ name, type, content }) {
  const blob = new Blob([content], { type });
  const elem = document.createElement('a');
  const objectUrl = URL.createObjectURL(blob);
  return objectUrl;
}

function cloneBlob(b) {
  return b.slice();

  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.readAsArrayBuffer(b);

    r.addEventListener('load', _ => {
      resolve(new Blob([r.result], { type: b.type }));
    });

    r.addEventListener('error', _ => {
      reject();
    });
  });
}