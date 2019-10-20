import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";

@observer 
export class Toolbar extends React.Component {
  render() {
    const { items } = this.props;
    return (
      <div className="ui attached text menu">
        <ToolbarItems items={items} />
      </div>
    )
  }
}

@observer
class ToolbarItems extends React.Component {
  render() {
    const { items } = this.props;
    return items.filter(Boolean).map((item, key) => {
      if (item.items) return <ToolbarDropdown key={key} item={item} />
      return <ToolbarButton key={key} item={item} />
    })
  }
}

@observer
class ToolbarButton extends React.Component {
  render() {
    const { item } = this.props;
    const icon = this.props.icon || item.icon;
    const label = this.props.label || item.label;
    return (
      <a
        className="item"
        onClick={item.execute}
      >
        {icon && <i className={"icon " + icon} />}
        {label}
      </a>
    )
  }
}

@observer
class ToolbarDropdown extends React.Component {
  render() {
    const { icon, label, items, toggle, active } = this.props.item;
    if (items.length === 1) return <ToolbarButton item={this.props.item.items[0]} label={label} icon={icon} />

    return (
      <div className={"ui simple dropdown item"}>
        <span onMouseDown={toggle}>
          {icon && <i className={"left floated icon " + icon} />}
          {label}
        </span>
        <i className="dropdown icon"></i>
        <div className="menu">
          <ToolbarItems items={items} />
        </div>
      </div>
    )
  }
}