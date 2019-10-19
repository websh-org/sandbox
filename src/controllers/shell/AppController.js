import { observable, action, reaction, computed } from "mobx";
import { Controller } from "~/lib/Controller";
import { RemoteController } from "./RemoteController";
import { getter } from "~/lib/utils";
import { AppInfo } from "~/lib/AppInfo";

export const AppController = Controller( class AppStore extends RemoteController.Store {
  @getter @observable _file=null
    
  constructor({ url, ...rest }) {
    super({url,...rest});
  }

  @computed get info() {
    const {url,manifest} = this;
    return new AppInfo({url,manifest})
  }

  @computed get title() {
    return (
      this.info.manifest.name || this.url
    )
  }


  static $actions = {
    "file-new": {
      async execute({format}) {
        this.assert(this.info.file.supported,"not-supported");
        return await this.request("file-new",{format});
      }
    },
    "file-open": {
      async execute({file,format}) {
        const {content,extension,type} = file;
        this._file=file;
        return await this.request("file-open",{format,content,extension,type});
      }
    },
    "file-save": {
      async execute({format}) {
        const res = await this.request("file-save",{format});
        const {content,type} = res;
        return Object.assign({},this.file,{content,type});
      }
    }
  }
});
