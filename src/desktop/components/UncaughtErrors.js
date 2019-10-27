import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { T } from "~/lib/utils";

import "../styles/styles.less";
import { ControllerError } from "~/lib/ControllerError";

const uncaughtErrors = observable.set();
const handleError = event => {
  //debugger;
  requestIdleCallback(()=>{
    uncaughtErrors.add(event);
    setTimeout(()=>uncaughtErrors.delete(event),10000);
  })
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
                Uncaught Error: {TE(event.reason)}
             </div>
            </div>
          ))
        }
     </div>
    )
  }
}

function TE(e) {
  const error = new ControllerError(e);
  return T('error:'+e.code )  + ": " + T('error:'+e.code+":message", e.data )
}