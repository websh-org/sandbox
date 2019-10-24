import React from "react";
import ReactDOM from "react-dom";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Desktop } from "../components/Desktop";
import { DesktopController } from "../controllers/DesktopController";
import { T } from "~/lib/utils";

import "../styles/styles.less";


@observer
export class App extends React.Component {
  desktop = DesktopController.create(this.props.config || {});

  async componentDidMount() {
    await this.desktop("show-launcher");

    //await this.desktop("launch-app",{url:"http://localhost:42003"})
  }
  render() {
    return (
      <>
        <Desktop desktop={this.desktop} />
        <UncaughtErrors/>
      </>
    )
  }
}

const uncaughtErrors = observable.set();
const handleError = event => {
  uncaughtErrors.add(event);
  setTimeout(()=>uncaughtErrors.delete(event),10000);
}
window.addEventListener("unhandledrejection",handleError);
window.addEventListener("error",handleError);

@observer
export class UncaughtErrors extends React.Component {
  render () {
    if (![...uncaughtErrors].length) return null;
    return (
      <div className="sh uncaught-errors ui messages">
        {
          [...uncaughtErrors].map(event => (
            <div key={event} className="ui error message">
             <i className="close icon" onClick={()=>uncaughtErrors.delete(event)}></i>
             <div className="header">
                Uncaught Error: {String(event.reason)}
             </div>
            </div>
          ))
        }
     </div>
    )
  }
}