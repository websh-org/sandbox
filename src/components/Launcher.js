import React from "react";
import { observable, computed } from "mobx";
import { observer } from "mobx-react";

import { UrlInput } from "~/ui/UrlInput";

@observer
export class Launcher extends React.Component {
  render() {
    return (
      <div className="sh launcher fitted ui segment">
        <div className="ui header">
          <i className="angle double right icon"/>
          <div className="content">
            Open App
          </div>
        </div>
        <LaunchFromUrl desktop={this.props.desktop}/>
      </div>
    );
  }
}

@observer class LaunchFromUrl extends React.Component {
  render() {
    const { desktop } = this.props;
    return <UrlInput onAction={(url)=>desktop("launch-app",{url})}/>
  }
}
