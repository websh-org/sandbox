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
    const file = this.file = await ShellFile.fromLocal(e.target.files[0]);
    this.format = this.listFormats[0] && this.listFormats[0].id;
    //this.props.dialog("resolve",{file});
  }

  @observable file = null;
  @observable format = "";
  @computed get listFormats() {
    const { formats } = this.props.data;
    if (!this.file) return formats.open;
    else return formats.matchAccept(this.file);
  }

  render() {
    const { dialog, data } = this.props;
    const { format, formats } = data;
    const id = uuid();
    return (
      <Dialog
        dialog={dialog}
        title="Open File"
        icon="open folder"
      >
        <ButtonTabs>
          <ButtonTabs.Tab label="From Disk">
              <div className="field">
                <label className="ui fluid left labeled blue button" htmlFor={id} style={{ whiteSpace: "nowrap" }}>
                  <a className="ui basic fluid label" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    {this.file ? this.file.name : ""}
                  </a>
                  <div className="ui button">
                    <i className="upload icon"></i> Select File
                </div>
                </label>
                <input className="ui dimmer" id={id} type="file" accept={formats.accept} onChange={this.openFromDisk} />
              </div>
          </ButtonTabs.Tab>
          {false &&
            <ButtonTabs.Tab label="From URL">
              <UrlInput />
            </ButtonTabs.Tab>
          }
        </ButtonTabs>
        <div className="ui tertiary form segment">
          <div className="inline field">
            <label>Open as:</label>
            <select className="ui fluid dropdown" value={this.format} onChange={e => this.format = e.target.value}>
              {!this.file && <option value="">All Accepted Files</option>}
              {this.listFormats.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            <button 
              className="ui right floated orange button"
              disabled={!this.file || !this.format}
              onClick={()=>this.props.resolve({file:this.file, format:this.format})}
            >OK</button>
            <div className="ui right floated grey button" onClick={()=>this.props.resolve(null)}>Cancel</div>
          </div>

        </div>
      </Dialog>
    );
  }
}
