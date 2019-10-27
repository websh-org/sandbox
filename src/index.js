import React from "react";
import ReactDOM from "react-dom";

import { App } from "./desktop/app/App"

history.pushState(null, "WebShell Sandbox", location.href);
window.onpopstate = function () {
  history.pushState(null, "WebShell Sandbox", location.href);
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
