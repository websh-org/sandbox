import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";

@observer
export class UrlInput extends React.Component {
  @observable url = "";
  @computed get realUrl() {
    if (!this.url) return null;
    try {
      const url = new URL(this.url);
      if (!url.protocol.match(/^https?:$/)) return null;
      return url.href;
    } catch(e) {
      return null;
    } 
  }

  render() {
    const { onAction } = this.props;
    return (
      <div className="ui action left icon fluid labeled input">
        <i className="world icon" />
        <input
          type="text"
          placeholder="Open From URL..."
          value={this.url}
          onChange={e => this.url = e.target.value}
          onKeyPress={e=>{
            if (e.key === "Enter" ) onAction(this.realUrl)
          }}
        />
        <button
          className="ui primary button"
          disabled = {!this.realUrl}
          onClick={() => onAction(this.realUrl)}
        >Open</button>
      </div>
    )
  }
}