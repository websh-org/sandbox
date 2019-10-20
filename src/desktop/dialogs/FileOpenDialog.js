import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";

import { Dialog } from "./Dialog";
import { UrlInput } from "~/desktop/ui/UrlInput";
@observer
export class FileOpenDialog extends React.Component {
  render() {
    const { dialog } = this.props;
    return (
      <Dialog 
        dialog={dialog}
        title="Open File" 
        icon="open folder"
        cancel
      >
        <div className="ui secondary padded form segment">
          <div className="field">
            <label> Open from disk </label>
            <button
              className="ui large left labeled icon button"
              onClick={async e => {
                const file = await openFromDisk();
                dialog("resolve", { file })
              }}
            >
              <i className="disk icon" />
              Select File
            </button>
          </div>
          <div className="field">
            <label>
              Open from URL
              </label>
            <UrlInput />
          </div>
        </div>
      </Dialog>
    );
  }
}

function openFromDisk() {
  return new Promise(resolve => {
    const input = document.createElement("input");
    input.type = "file";
    input.addEventListener("change", async function readFile(e) {
      const localFile = e.target.files[0];
      const { name, type, size, lastModified: mtime } = localFile;
      const file = { name, type, size, mtime };
      file.fid = "file";
      file.pid = "";
      file.content = await localFile.text();
      resolve(file);
    }, true);
    input.click();
  })
} 