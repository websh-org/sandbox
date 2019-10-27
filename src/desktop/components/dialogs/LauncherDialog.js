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
              infos.map(info => (
                <div
                  key={info.url}
                  className="sh launch button ui basic button"
                  title={info.about.description}
                  onClick={() => resolve({ url: info.url })}
                >
                  <AppIcon url={info.about.icon} />
                  <div className="name">
                    {info.about.name}
                  </div>
                </div>
              ))
            }
          </ButtonTabs.Tab>
          <ButtonTabs.Tab id="url" label="Open From URL">
            <UrlInput onAction={(url) => dialog("resolve", { url })} />
          </ButtonTabs.Tab>
        </ButtonTabs>
      </Dialog>
    );
  }
}
