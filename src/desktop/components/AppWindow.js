import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import { Window } from "./Window";

@observer
export class AppWindow extends React.Component {
  refIframe = element => {
    if (element) this.props.window("load", { element });
  }

  render() {
    const { window } = this.props;
    return (
      <Window window={window}>
        <iframe sandbox="allow-scripts" ref={this.refIframe} />
      </Window>
    );
  }
}

