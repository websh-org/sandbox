import React from "react";

import { observer } from "mobx-react";
import { computed, observable, toJS } from "mobx";
import { Toolbar } from "~/desktop/ui/Toolbar"
import { Icon, AppIcon } from "~/desktop/ui/"
import { windowTypes } from "./windows"
import "./Window.less";
import { WindowDebug } from "./WindowDebug";
const stateLabels = {
  INITIAL: "Loading",
  LOADED: "Connecting to"
}

@observer
export class Window extends React.Component {
  
  @computed get classes() {
    const ret = [];
    const { active } = this.props.window;
    active && ret.push("active");
    return ret.join(" ");
  }

  @observable showDebug = false;

  render() {
    const { window } = this.props;
    const { type, title, icon, wid, active, zIndex } = window;
    const Inner = windowTypes[type];
    return (
      <div
        className={"sh window " + this.classes}
        title={wid}
        style={{ zIndex }}
        data-state={window.state}
      >
        <div className="titlebar">
          <TitleBar window={window} />
        </div>
        {this.props.toolbar && this.props.toolbar.items && <Toolbar items={this.props.toolbar.items} />}
        <div className="main">
        <div className="client">
          <Inner window={window} />
        </div>
        {
          this.showDebug &&
          <div className="debug">
            <WindowDebug window={window}/>
          </div>
        }
        <div className="sh loader ui text loader">{stateLabels[window.state] || window.state} {title}...</div>
        </div>
        <div className="statusbar">
          <i className="sh selectable wrench icon"
            data-active={this.showDebug}
            onClick={()=>this.showDebug=!this.showDebug}
          />
          <small>{window.state}</small>
        </div>
      </div>
    );
  }
}


@observer class TitleBar extends React.Component {
  render() {
    const { window } = this.props;
    const { title } = window;
    const api = window.proc.api;
    return (
      <>
        <span className="title">
          <AppIcon url={window.icon} size="mini" />
          &nbsp;
          {title}
        </span>
        {
          api.file && api.file.currentFile &&
          <span
            className="file"
            title={JSON.stringify(api.file.currentFile, null, 2)}
          >
            <Icon icon="file" />
            {api.file.currentFile.name}
          </span>
        }
      </>
    )
  }
}

