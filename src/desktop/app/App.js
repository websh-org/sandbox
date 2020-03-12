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
    await this.desktop("launch-local",{
      keepOpen:true,
      url:"about-shell"
    });
    await this.desktop("launch-fs",{ url:"http://localhost:1235/" });
    await this.desktop("launch-app",{ url:"https://websh.org/app-quill/" });
  }
}
