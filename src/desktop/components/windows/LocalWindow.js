import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import { localWindows } from "./index"

@observer
export class LocalWindow extends React.Component {
  loadWindow = element => {
    if (element) this.props.window("load", { element });
  }
  render() {
    const {kind} = this.props.window.proc;
    const Local = localWindows[kind]
    if(!Local) return <span>Local window {kind} not found.</span>
    return (
      <Local window={window} ref={this.loadWindow}/>
    );
  }
}

