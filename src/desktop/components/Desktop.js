import React from "react";
import { observer } from "mobx-react";
import { AppWindow } from "./AppWindow";
import { ErrorBoundary } from "./ErrorBoundary"
import { dialogs } from "../dialogs";
import { Icon } from "../ui/Icon";

@observer
export class Desktop extends React.Component {
  render() {
    const { desktop } = this.props;
    return (
      <div className="sh desktop">
        <Dock desktop={desktop} />
        <div className="windows">
          {desktop.windows.map(window => (
            <ErrorBoundary>
              <AppWindow key={window.wid} window={window} />
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
  render() {
    const { desktop } = this.props;
    return (
      <div className="sh dock ui attached inverted menu">
        <a className="item" onClick={() => desktop("show-launcher")}>
          <Icon icon="large" image="/web-shell-logo.png" />
        </a>
        {desktop.windows.map(window => (
          <a
            onClick={() => desktop("window-activate", { window })}
            key={window.wid}
            className={"item" + (window.active ? " active" : "")}
          >
            <Icon image={window.icon} />
            {window.title}
            <span
              onClick={() => desktop("window-close", { window })}
              style={{
                marginLeft: "1em",
                marginRight: "-0.5em"
              }}>
              <Icon icon="small link close" />
            </span>
          </a>
        ))}
      </div>
    );
  }
}