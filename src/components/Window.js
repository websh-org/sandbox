import React from "react";
import { observer } from "mobx-react";
import { computed } from "mobx";
import { Toolbar } from "~/ui/Toolbar"

@observer
export class Window extends React.Component {
  render() {
    const { window, children } = this.props;
    const { title, wid } = window;
    return (
      <div className="sh window ui segments" title={wid}>
        <div className="titlebar ui tiny tight inverted orange header segment">
          <div className="title">{title}</div>
        </div>
        {window.toolbar && <Toolbar items={window.toolbar.items} />}
        <div className="client ui fitted segment">
          {children}
        </div>
        <div className="statusbar ui tight secondary segment">
          <small>{window.proc.state}</small>
        </div>
      </div>
    );
  }
}
