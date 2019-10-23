import React from "react";
import ReactDOM from "react-dom";
import { observer } from "mobx-react";

import { Desktop } from "../components/Desktop";
import { DesktopController } from "../controllers/DesktopController";

import "../styles/styles.less";

@observer
export class App extends React.Component {
  desktop = DesktopController.create(this.props.config || {});
  componentDidMount() {
    this.desktop("launch-app",{url:"http://localhost:42003"})
  }
  render() {
    return <Desktop desktop={this.desktop} />
  }
}
