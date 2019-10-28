import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { Window } from "./Window";
import { ErrorBoundary } from "./ErrorBoundary"
import { dialogs } from "./dialogs";
import { Icon, AppIcon } from "../ui";

import logo from "~/../static/web-shell-logo.png"

@observer
export class Desktop extends React.Component {
  render() {
    const { desktop } = this.props;
    return (
      <div className="sh desktop">
        <Dock desktop={desktop} />
        <div className="windows">
          {desktop.windows.map(window => (
            <ErrorBoundary key={window.wid}>
              <Window window={window} toolbar={desktop.toolbarFor(window)} />
            </ErrorBoundary>
          ))}
        </div>
        <Modal dialog={desktop.modal} desktop={desktop} />
      </div>
    );
  }
}

@observer
class Modal extends React.Component {
  render() {
    const { dialog } = this.props;
    if (!dialog) return null;

    const Dialog = dialogs[dialog.type];
    if (!Dialog) return null;

    return (
      <div className="sh modals" onClick={e => dialog("resolve", null)}>
        <ErrorBoundary>
          <Dialog
            dialog={dialog}
            data={dialog.data}
            resolve={res => dialog("resolve", res)}
            resolver={res => () => dialog("resolve", res)}
            reject={err => dialog("reject", err)}
          />
        </ErrorBoundary>
      </div>
    )
  }
}



@observer class Dock extends React.Component {
  @observable started = false;
  render() {
    const { desktop } = this.props;
    return (
      <div className="sh dock ui attached inverted menu">
        <a className="item" onClick={() => {
          this.started = true;
          desktop("show-launcher")
        }}
          style={{ position: "relative" }}
        >
          <AppIcon url={logo} size="tiny" />
          <b>&nbsp;&nbsp;Menu</b>
          {!this.started &&
            <div style={{ position: "absolute", whiteSpace: "nowrap", zIndex: 2, top: "10px", left: "85px" }}>
              <div className="ui large red left pointing label">
                Start here
              </div>
            </div>
          }
        </a>
        {desktop.windows.map(window => (
          <a
            onClick={() => desktop("window-activate", { window })}
            key={window.wid}
            title={window.wid}
            className={"item" + (window.active ? " active" : "")}
          >
            <AppIcon url={window.icon} size="tiny" /> &nbsp; 
            {window.proc.file ? window.proc.file.name : window.title}
            {!window.keepOpen && <span
              onClick={() => desktop("window-close", { window })}
              style={{
                marginLeft: "1em",
                marginRight: "-0.5em"
              }}>
              <Icon icon="small link close" />
            </span>
            }
          </a>
        ))}
      </div>
    );
  }
}