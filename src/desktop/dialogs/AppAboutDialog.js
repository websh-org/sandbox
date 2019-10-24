import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";

import { Dialog } from "./Dialog";
import { UrlInput } from "~/desktop/ui/UrlInput";

@observer
export class AppAboutDialog extends React.Component {
  render() {
    const { dialog } = this.props;
    const { about } = dialog.data;
    console.log(about)
    const { name, icon, description, license, homepage, repository, version } = about;
    return (
      <Dialog 
        dialog={dialog}
        title={"About " + name}
        icon="info"
      >
        <div className="ui secondary very padded center aligned secondary segment">
          <div className="ui small image">
            {version && <div className="ui blue ribbon label">{version}</div>  }
            <img src={icon}/>
          </div>
         </div>
        <div className="ui padded center aligned form segment">
          <div className="ui large header">
            {name}
            <div className="sub header">{description}</div>
          </div>
          <p>
            {license.name} 
            { homepage && <> &middot; <a target="_blank" href={homepage} >homepage</a> </>}
            { repository && <> &middot; <a target="_blank" href={repository} >source</a> </>}
          </p>
        </div>
      </Dialog>
    );
  }
}

const formats = {
  quill: {
    encoding: "text",
    label: "Quill File",
    type: "application/json",
    extension: "quill",
    accept: "text/plain",
    open: true,
    save: true,
    save_as: ["text","html"]
  },
  text: {
    encoding: "text",
    label: "Text File",
    extension: ".txt",
    opens: "quill"
  }
}