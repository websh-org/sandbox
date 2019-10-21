import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";

import { Dialog } from "./Dialog";

@observer
export class FileSaveDialog extends React.Component {

  componentDidMount() {
    this.fileName.set(this.props.data.file.name);
    this.objectUrl = URL.createObjectURL(this.props.data.file.content);
  }

  componentWillUnmount() {
    URL.revokeObjectURL(this.objectUrl)
  }

  fileName = observable.box("");

  render() {
    const { dialog } = this.props;
    const { file } = dialog.data;
    if (!file) return null;

    return (
      <Dialog dialog={dialog} icon="save" title="Save File">
        <div className="ui secondary padded form segment">
          <div className="inline field">
            <label>File Name</label>
            <Input value={this.fileName} />
          </div>
          <div className="ui tiny header">
            Save to Disk
            </div>
          <a
            className="ui large left labeled icon button"
            disposition="download"
            download = {this.fileName.get()}
            href={this.objectUrl}
            onClick={() => {
              file.name = this.fileName.get()
              requestIdleCallback(
                () => dialog("resolve", { file })
              )
            }}
          >
            <i className="download icon" />
            Save 
          </a>
        </div>
      </Dialog>
    );
  }
}

@observer
class Input extends React.Component {
  render() {
    return (
      <div className="ui fluid input">
        <input type="text" autoFocus value={this.props.value.get()} onChange={e => { this.props.value.set(e.target.value) }} />
      </div>
    )
  }
}