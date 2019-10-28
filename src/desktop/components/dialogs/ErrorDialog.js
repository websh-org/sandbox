import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import { Dialog } from "./Dialog";
import { T } from "~/lib/utils";
import { DataList } from "~/desktop/ui";

@observer
export class ErrorDialog extends React.Component {
  @observable value;


  render() {
    const { dialog, resolve, resolver, reject, data } = this.props;
    const { error } = data;
    return (
      <Dialog dialog={dialog} icon="question" title="Error">
        <div className="ui padded  segment">
          <div className="ui error icon message">
          <i className="red ban icon"></i>
          <div className="content">
            <div className="header">{T("error",error.code)}</div>
            <p>{T("error",error.code,"message",error.data)}</p>
            <details>
              <summary className="ui label">Details</summary>
            <div className="ui list">
              <DataList data={error.data} id="Error Data"/>
            </div>
            </details>
          </div>
          </div>
        </div>
        <div className="ui basic secondary right aligned segment">
            <a className="ui orange button" onClick={resolver()}>Close</a>
        </div>
      </Dialog>
    );
  }
}
