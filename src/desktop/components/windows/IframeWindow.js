import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";

@observer
export class IframeWindow extends React.Component {
  loadWindow = element => {
    if (element) this.props.window("load", { element });
  }

  render() {
    return (
      <iframe sandbox="allow-scripts" ref={this.loadWindow} />
    );
  }
}

