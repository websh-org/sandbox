import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";

@observer
export class PromptDialog extends React.Component {
  @observable value;

  render() {
    const {dialog}=this.props;
    return (
      <div className="sh dialog">
        <div className="ui segments">
          <div className="ui small inverted header segment">
            <span>
              <i className="open folder icon" />
              Prompt
            </span>
          </div>
          <div className="ui secondary form segment">
            <div className="field">
              <div className="ui fluid input">
                <input 
                  type="text"
                  autoFocus={true}
                  value={this.url}
                  onChange={e=>this.value = e.target.value }
                ></input>
              </div>
            </div>
            <div className="ui right aligned field">
              <button className="ui toggle button">
                Cancel
            </button>
              <button 
                className="ui toggle orange button" 
                disabled={!this.value}
                onClick={()=>dialog("resolve",this.value)}
              >
                OK
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

