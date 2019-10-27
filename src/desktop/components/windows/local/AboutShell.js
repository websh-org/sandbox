import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";

@observer
export class AboutShell extends React.Component {
  loadWindow = element => {
    if (element) this.props.window("load", { element });
  }

  render() {
    return (
      <div className="ui container">
        <div className="ui header">
          <h1>WebShell Sandbox</h1>
          <div className="sub header">
            The new way to use web apps with your files.
          </div>
        </div>
      </div>
    );
  }
}

