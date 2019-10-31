import React from "react";
import { observer } from "mobx-react";
import { Desktop } from "../components/Desktop";
import { DesktopController } from "../controllers/DesktopController";

import "../styles/styles.less";
import { UncaughtErrors } from "../components/UncaughtErrors";


@observer
export class App extends React.Component {
  desktop = DesktopController.create(this.props.config || {});

  render() {
    return (
      <>
        <Desktop desktop={this.desktop} />
        <UncaughtErrors/>
      </>
    )
  }

  async componentDidMount() {
    //await this.desktop("show-launcher");
    await this.desktop("window-open",{
      keepOpen:true,
      uri:"webshell:local:about-shell"
    });
    //await this.desktop("window-open",{ uri:"webshell:app:https://websh.org/app-quill/" });
  }
}
