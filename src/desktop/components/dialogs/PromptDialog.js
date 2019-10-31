import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";

@observer
export class PromptDialog extends React.Component {
  @observable value;

  render() {
    const { dialog } = this.props;
    return (
      <Dialog dialog={dialog} icon="question" title="Prompt">
        <div className="ui secondary form segment">
          <div className="field">
            <div className="ui fluid input">
              <input
                type="text"
                autoFocus={true}
                value={this.value}
                onChange={e => this.value = e.target.value}
              ></input>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

