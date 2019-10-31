import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { Window } from "./Window";
import { ErrorBoundary } from "./ErrorBoundary"
import { dialogs } from "./dialogs";
import { Dock } from "./Dock";
import "./Desktop.less";

@observer
export class Desktop extends React.Component {
  render() {
    const { desktop } = this.props;
    return (
      <div className="sh desktop" data-colors="default" data-layout="default" data-theme="default">
        <Dock desktop={desktop} />
        <div className="windows">
          {desktop.windows.map(window => (
            <ErrorBoundary key={window.wid}>
              <Window window={window} desktop={desktop} toolbar={desktop.toolbarFor(window)} />
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

