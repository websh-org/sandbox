import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import { Dialog } from "./Dialog"
import { UrlInput, AppIcon, ButtonTabs} from "../../ui";

@observer
export class LauncherDialog extends React.Component {
  @observable value;

  render() {
    const { dialog, data, resolve } = this.props;
    const { infos } = data;
    return (
      <Dialog dialog={dialog} icon="rocket" title="Launch App">
        <ButtonTabs>
          <ButtonTabs.Tab id="apps" label="Your Apps">
            {
              infos
              .filter(info=>info.type==="app")
              .map(info => (
                <div
                  key={info.uri}
                  className="sh launch button ui basic button"
                  title={info.about.description}
                  onClick={() => resolve({ uri: info.uri })}
                >
                  <AppIcon url={info.about.icon} />
                  <div className="name">
                    {info.about.short_name}
                  </div>
                </div>
              ))
            }
          </ButtonTabs.Tab>
          <ButtonTabs.Tab id="url" label="Open From URL">
            <UrlInput onAction={(url) => dialog("resolve", { uri:"webshell:app:"+url })} />
          </ButtonTabs.Tab>
        </ButtonTabs>
      </Dialog>
    );
  }
}
