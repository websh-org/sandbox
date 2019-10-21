import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import { ShellFile } from "~/lib/ShellFile";
import { Dialog } from "./Dialog";
import { UrlInput } from "~/desktop/ui/UrlInput";
@observer
export class FileOpenDialog extends React.Component {
  render() {
    const { dialog, data } = this.props;
    const { format } = data;
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
                const file = await openFromDisk(format);
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

function openFromDisk(format) {
  return new Promise(resolve => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = (format.extensions.includes("*") ? [] : format.extensions.map(e=>"."+e).concat(format.types).join(","))
    console.log(input.accept);
    input.addEventListener("change", async function readFile(e) {
      if (!e.target.files.length) resolve(null);
      const localFile = e.target.files[0];
      const file = ShellFile.fromLocal(localFile);
      resolve(file);
    }, true);
    requestIdleCallback(()=>input.click());
  })
}
