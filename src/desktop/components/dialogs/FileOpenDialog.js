import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import { ShellFile } from "~/lib/ShellFile";
import { uuid } from "~/lib/utils";
import { Dialog } from "./Dialog";
import { UrlInput, ButtonTabs } from "~/desktop/ui";
@observer
export class FileOpenDialog extends React.Component {

  openFromDisk = async e => {
    if (!e.target.files.length) return this.props.resolve(null);
    const file = await ShellFile.fromLocal(e.target.files[0]);
    this.props.dialog("resolve",{file});
  }

  render() {
    const { dialog, data } = this.props;
    const { format } = data;
    const id = uuid();
    return (
      <Dialog
        dialog={dialog}
        title="Open File"
        icon="open folder"
        cancel
      >
        <ButtonTabs>
          <ButtonTabs.Tab label="From Disk">
            <div className="ui basic center aligned segment">
              <label className="ui left big labeled icon blue button" htmlFor={id}>
                <i className="upload icon" />
                Upload File
              </label>
              <input className="ui dimmer" id={id} type="file" accept={format.accept} onChange={this.openFromDisk} />
             </div>
          </ButtonTabs.Tab>
          {false && 
          <ButtonTabs.Tab label="From URL">
            <UrlInput />
          </ButtonTabs.Tab>
          }
        </ButtonTabs>
      </Dialog>
    );
  }
}
