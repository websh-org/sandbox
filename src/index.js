import React from "react";
import ReactDOM from "react-dom";

import { Desktop } from "./desktop/components/Desktop";
import { DesktopController } from "./desktop/controllers/DesktopController";

import "./styles.less";

const desktop = DesktopController({});

const rootElement = document.getElementById("root");
ReactDOM.render(<Desktop desktop={desktop} />, rootElement);

desktop("launch-app", { url: "https://websh.org/app-ace/" });

desktop("show-launcher");
