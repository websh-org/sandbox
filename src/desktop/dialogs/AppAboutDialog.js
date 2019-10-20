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
    const { name, icon, description } = about;
    return (
      <Dialog 
        dialog={dialog}
        title="About app" 
        icon="info"
        OK
      >
        <div className="ui secondary very padded center aligned form segment">
          <div className="ui small image">
            <img src={icon}/>
          </div>
          <div className="ui large header">
            {name}
            <div className="sub header">{description}</div>
          </div>
        </div>
      </Dialog>
    );
  }
}
