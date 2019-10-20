import React from "react";
import { observable, computed } from "mobx";
import { observer } from "mobx-react";

import { Icon } from "~/desktop/ui/Icon";

@observer
export class Launcher extends React.Component {
  render() {
    return (
      <div className="ui icon button" onClick={()=>this.props.desktop("show-launcher")}>
        <Icon icon="bars"/>
      </div>
    );
  }
}

