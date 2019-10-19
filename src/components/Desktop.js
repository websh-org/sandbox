import React from "react";
import { observer } from "mobx-react";
import { AppWindow } from "./AppWindow";
import { Launcher } from "./Launcher";
import { ErrorBoundary } from "./ErrorBoundary"
import { dialogs } from "./dialogs";

@observer
export class Desktop extends React.Component {
  render() {
    const { desktop } = this.props;
    return (
      <div className="sh desktop">
        <Launcher desktop={desktop}/>
        <div className="windows">
          {desktop.windows.map(window => (
            <AppWindow key={window.wid} window={window} />
          ))}
        </div>
        <ErrorBoundary>
          <Modal dialog={desktop.modal} desktop={desktop}/>
        </ErrorBoundary>
      </div>
    );
  }
}

@observer
class Modal extends React.Component {
  render() {
    const { dialog } = this.props;
    if(!dialog) return null;

    const Dialog = dialogs[dialog.type];
    if(!Dialog) return null;
    return (
      <div className="sh modals" onClick={e=>dialog("resolve",null)}>
        <div onClick={e=>e.stopPropagation()}>
          <Dialog dialog={dialog} />
        </div>
      </div>
    )
  }
}