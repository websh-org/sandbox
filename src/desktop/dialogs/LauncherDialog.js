import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import { UrlInput } from "~/desktop/ui/UrlInput";
import { Dialog } from "./Dialog"
import { Icon } from "../ui/Icon";
import { AppIcon } from "../ui/AppIcon";

@observer
export class LauncherDialog extends React.Component {
  @observable value;

  render() {
    const { dialog, data, resolve } = this.props;
    const { infos } = data;
    return (
      <Dialog dialog={dialog} icon="rocket" title="Launch App">
        <div className="ui form secondary segment">
          <div className="field">
          <label>Your Apps</label>
              {
                infos.map(info => (
                  <div 
                    key={info.url} 
                    className="ui button" 
                    title={info.about.description}
                    onClick={()=>resolve({url:info.url})}
                  >
                    <AppIcon url={info.about.icon}/>
                    <b >
                      {info.about.name}
                    </b>
                  </div>
                ))
              }
          </div>
          <div className="field">
            <label>Open App From URL</label>
            <UrlInput onAction={(url) => dialog("resolve", { url })} />
          </div>
        </div>

      </Dialog>
    );
  }
}

