import React from "react";
import ReactDOM from "react-dom";
import { observer } from "mobx-react";

import { Desktop } from "../components/Desktop";
import { DesktopController } from "../controllers/DesktopController";

import "../styles/styles.less";

@observer
export class App extends React.Component {
  componentWillMount() {
    this.desktop = DesktopController(this.props.config || {});
  }
  render() {
    return <Desktop desktop={this.desktop} />
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
