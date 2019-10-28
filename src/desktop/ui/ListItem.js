import React from "react";
import { observer } from "mobx-react";

@observer 
export class ListItem extends React.Component {
  render() {
    const { image, name, extra, remove, active, onClick, onRemove } = this.props;
    return (
      <div className="item" data-active={active} onClick={onClick} >
        <div className="sh image">
          <img src={image} />
        </div>
          {(name || extra) &&
            <div className="title">
              {name && <div className="name">{name}</div>}
              {extra && <div className="extra">{extra}</div>}
            </div>
          }
          {remove &&
            <div
              className="remove"
              onClick={onRemove}
            ></div>
          }
      </div>
    )
  }
}


