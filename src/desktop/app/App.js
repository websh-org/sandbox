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
    await this.desktop("launch-proc",{type:"local",kind:"about-shell",keepOpen:true}),
    await this.desktop("launch-proc",{type:"web",url:"https://websh.org"})
  }
}
