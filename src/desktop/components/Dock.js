import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { ListItem } from "../ui";

import "./Dock.less";
import logo from "~/../static/web-shell-logo.png"

@observer
export class Dock extends React.Component {
  @observable started = false;
  render() {
    const { desktop } = this.props;
    return (
      <div className="sh dock">
        <MainMenuButton desktop={desktop} />
        {desktop.windows.map(window => (
          <WindowButton key={window.wid} desktop={desktop} window={window} />
        ))}
      </div>
    );
  }
}

@observer class WindowButton extends React.Component {
  onClick = () => {
    const { desktop, window } = this.props;
    desktop("window-activate", { window });
  }
  onRemove = () => {
    const { desktop, window } = this.props;
    desktop("window-close", { window });
  }

  render() {
    const { desktop, window } = this.props;
    return (
      <ListItem
        image={window.icon}
        active={window.active}
        onClick={this.onClick}
        onRemove={this.onRemove}
        remove={!window.keepOpen}
        name={window.info.about ? window.info.about.short_name : window.proc.title }
        extra={window.proc.file && window.proc.file.name }
      />
    )
  }
}


@observer class MainMenuButton extends React.Component {
  onClick = () => this.props.desktop("show-launcher");

  render() {
    return (
      <a className="item" onClick={this.onClick} >
        <div className="sh image">
          <img src={logo} />
          <div className="title"></div>
        </div>
      </a >
    )
  }
}
