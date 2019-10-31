import React from "react";

import { observer } from "mobx-react";
import { computed, observable, toJS } from "mobx";
import { ButtonTabs } from "../ui";


@observer 
export class WindowDebug extends React.Component {
  render() {
    const {window}=this.props;
    return(
      <div>
        <code>{window.proc.uri}</code>
        <textarea style={{display:"block"}} disabled value={JSON.stringify(toJS(window.proc.manifest),null,2)}/>
        <textarea style={{display:"block"}} disabled value={JSON.stringify(toJS(window.proc.info,{recurseEverything:true}),null,2)}/>
      </div>
    )
  }
}