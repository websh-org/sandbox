import React from "react";

import { observer } from "mobx-react";
import { computed } from "mobx";
import { Toolbar } from "~/desktop/ui/Toolbar"
import { Icon } from "~/desktop/ui/Icon.js"

@observer
export class Window extends React.Component {
  render() {
    const { window, children } = this.props;
    const { title, icon, wid } = window;
    return (
      <div className="sh window ui segments" title={wid}>
        <div className="titlebar ui form inverted segment">
          <span className="title">
            <Icon image={window.icon} />
            {title}
          </span>
          {
            window.proc.file &&
            <span className="file">
              <Icon icon="file"/>
              {window.proc.file.name}
            </span>
          }
        </div>
        {window.toolbar && <Toolbar items={window.toolbar.items} />}
        <div className="client">
          {children}
        </div>
        <div className="statusbar ui tight secondary segment">
          <small>{window.proc.state}</small>
        </div>
      </div>
    );
  }
}
