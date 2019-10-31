import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import { localWindows } from "./index"

@observer
export class LocalWindow extends React.Component {
  loadWindow = element => {
    if (element) this.props.window("load", { element, manifest:element.manifest });
  }
  render() {
    const {window,desktop} = this.props;
    const {locator} = window.proc;
    const Local = localWindows[locator]
    if(!Local) return <span>Local window {locator} not found.</span>
    return (
      <Local window={window} desktop={desktop} ref={this.loadWindow}/>
    );
  }
}

