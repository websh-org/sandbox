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
    const { name, icon, description, license, homepage, repository, version } = about;
    return (
      <Dialog 
        dialog={dialog}
        title={"About " + name}
        icon="info"
      >
        <div className="ui secondary very padded center aligned secondary segment">
          <div className="ui small image" style={{position:"relative"}}>
            {version && <div className="ui ribbon mini black label">{version}</div>  }
            <img src={icon} style={{width:"100%"}}/>
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
