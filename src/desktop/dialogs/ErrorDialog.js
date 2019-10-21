import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import { Dialog } from "./Dialog";

@observer
export class ErrorDialog extends React.Component {
  @observable value;


  render() {
    const { dialog, resolve, resolver, reject, data } = this.props;
    const { error } = data;
    return (
      <Dialog dialog={dialog} icon="question" title="Unhandled error">
        <div className="ui padded  segment">
          <div className="ui error icon message">
          <i className="bug icon"></i>
          <div className="content">
            <div className="header">{error.code}</div>
            <p>{error.message}</p>
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

