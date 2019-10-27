import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import { Dialog } from "./Dialog";

@observer
export class FileUnsavedDialog extends React.Component {
  @observable value;


  render() {
    const { dialog, resolve, resolver, reject } = this.props;
    return (
      <Dialog dialog={dialog} icon="question" title="Closing app ...">
        <div className="ui padded  segment">
          <div className="ui warning icon message">
          <i className="warning icon"></i>
          <div className="content">
            <div className="header">You have unsaved changes</div>
            <p>Do you want to save them now?</p>
          </div>
          </div>
        </div>
        <div className="ui basic secondary right aligned segment">
            <a className="ui button" onClick={resolver(null)}>Cancel</a>
            <a className="ui button" onClick={resolver({save:false,confirmed:true})}>Exit Without Saving</a>
            <a className="ui orange button" onClick={resolver({save:true,confirmed:true})}>Save</a>
        </div>
      </Dialog>
    );
  }
}

