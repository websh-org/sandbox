import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import { Icon } from "~/desktop/ui/Icon.js"

@observer
export class Dialog extends React.Component {
  @observable value;

  OK = () => {
    if (typeof this.props.OK == "function") {
      this.props.OK();
    } else {
      this.props.dialog("resolve", true);
    }
  }

  cancel = () => {
    if (typeof this.props.cancel == "function") {
      this.props.cancel();
    } else {
      this.props.dialog("resolve", false);
    }
  }

  render() {
    const { dialog, title, icon, OK, cancel, children } = this.props;
    return (
      <div className="sh dialog">
        <div className="ui segments">
          <div className="ui small inverted header segment">
            <span>
              {icon && <Icon icon={icon} />}
              {title}
              <span style={{float:"right"}} >
                <Icon icon="fitted link close" onClick={this.cancel}/>
              </span>
            </span>
          </div>
          {children}
          {
            (OK || cancel) &&
            <div className="ui tertiary form segment">
              <div className="ui right aligned field">
                {
                  cancel &&
                  <button className="ui grey button" onClick={this.cancel}>
                    Cancel
                  </button>
                }
                {
                  OK &&
                  <button
                    className="ui orange button"
                    onClick={this.OK}
                  >
                    OK
                  </button>
                }
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

