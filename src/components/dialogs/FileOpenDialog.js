import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";

import { UrlInput } from "~/ui/UrlInput";
import { dialogs } from ".";

@observer
export class FileOpenDialog extends React.Component {
  render() {
    const { dialog } = this.props;
    return (
      <div className="sh dialog">
        <div className="ui segments">
          <div className="ui small inverted header segment">
            <span>
              <i className="open folder icon" />
              Open File
            </span>
          </div>
          <div className="ui secondary form segment">
            <div className="ui tiny header">
              Open from disk
            </div>
            <button
              className="ui large left labeled icon button"
              onClick={async e => {
                const file = await openFromDisk();
                console.log(file);
                dialog("resolve", { file })
              }}
            >
              <i className="disk icon" />
              Select File
            </button>
            <div className="ui tiny header">
              Open from URL
        </div>
            <UrlInput />
          </div>
        </div>
      </div>
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