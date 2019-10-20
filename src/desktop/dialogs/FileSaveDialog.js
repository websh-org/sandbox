import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";

import { Dialog } from "./Dialog";

@observer
export class FileSaveDialog extends React.Component {

  componentWillUnmount() {
    URL.revokeObjectURL(this.objectUrl)
  }
  render() {
    const { dialog } = this.props;
    const { file } = dialog.data;
    this.objectUrl = createObjectURL(file);

    return (
      <Dialog dialog={dialog} icon="save" title="Save File">
        <div className="ui secondary center aligned very padded form segment">
          <div className="ui tiny header">
            Save to Disk
            </div>
          <a
            className="ui large left labeled icon button"
            disposition="download"
            download={file.name}
            href={this.objectUrl}
          //onClick={dialog("resolve",{file})}
          >
            <i className="download icon" />
            {file && file.name}
          </a>
        </div>
      </Dialog> 
    );
  }
}

function createObjectURL({ name, type, content }) {
  const blob = new Blob([content], { type });
  const elem = document.createElement('a');
  const objectUrl = URL.createObjectURL(blob);
  return objectUrl;
} 
