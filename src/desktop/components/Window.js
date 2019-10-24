import React from "react";

import { observer } from "mobx-react";
import { computed } from "mobx";
import { Toolbar } from "~/desktop/ui/Toolbar"
import { Icon, AppIcon } from "~/desktop/ui/"

const stateLabels = {
  INITIAL: "Loading",
  LOADED: "Connecting to"
}

@observer
export class Window extends React.Component {
  @computed
  get classes() {
    const ret = [];
    const { active } = this.props.window;
    active && ret.push("active");
    return ret.join(" ");
  }
  render() {
    const { window, children } = this.props;
    const { title, icon, wid, active, zIndex } = window;

    return (
      <div 
        className={"sh window ui segments "+this.classes}
        title={wid}
        style={{ zIndex }}
        data-state={window.state}
      >
        <div className="titlebar ui form inverted segment">
          <span className="title">
           <AppIcon url={window.icon} size="mini"/> &nbsp; {title}
          </span>
          {
            window.file &&
            <span className="file" title={JSON.stringify(window.file,null,2)}>
              <Icon icon="file"/>
              {window.file.name}
            </span>
          }
        </div>
        {window.toolbar && <Toolbar items={window.toolbar.items} />}
        <div className="client">
          {children}
        </div>
        <div className="statusbar ui tight secondary segment">
          <small>{window.state}</small>
        </div>
        <div className="sh loader ui text loader">{stateLabels[window.state]||window.state} {title}...</div> 
      </div>
    );
  }
}
