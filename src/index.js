import React from "react";
import ReactDOM from "react-dom";

import { Desktop } from "./components/Desktop";
import { DesktopController } from "./controllers/desktop/DesktopController";

import "./styles.less";

const desktop = DesktopController({});

const rootElement = document.getElementById("root");
ReactDOM.render(<Desktop desktop={desktop} />, rootElement);

desktop("launch-app", { url: "https://websh.org/app-ace/" });

