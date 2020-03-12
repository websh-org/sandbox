import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";

@observer
export class Toolbar extends React.Component {
  render() {
    const { items } = this.props;
    return (
      <div className="sh toolbar">
        <ToolbarItems items={items} />
      </div>
    )
  }
}

@observer
class ToolbarItems extends React.Component {
  render() {
    const { items = [] } = this.props;
    return items.map((item, key) => <ToolbarItem key={key} item={item} />)
  }
}

@observer
class ToolbarItem extends React.Component {
  render() {
    const { item } = this.props;
    const { type, available, items } = item;
    if (!available) return null;
    if (type === 'group') {
      const attr = {};
      if (item.order) attr["data-order"]=item.order;
      return (
        <div className="group" {...attr}>
          <ToolbarItems items={items} />
        </div>
      )
    }
    if (items) return <ToolbarDropdown item={item} />
    return <ToolbarButton item={item} />
  }
}

@observer
class ToolbarButton extends React.Component {
  render() {
    const { item } = this.props;
    const icon = this.props.icon || item.icon;
    const label = this.props.label || item.label;
    const attr = {};
    if (item.order) attr["data-order"]=item.order;
    return (
      <a
        {...attr}
        className="item"
        tabIndex={-1}

        onClick={e => {
          document.activeElement.blur()
          item.execute();
        }}
      >
        {icon && <span className="image"><i className={"icon " + icon} /></span>}
        {label}
      </a>
    )
  }
}

@observer
class ToolbarDropdown extends React.Component {

  @observable open = false;

  render() {
    const { icon, label, items } = this.props.item;
    if (items.length === 1) return <ToolbarButton item={this.props.item.items[0]} label={label} icon={icon} />

    return (
      <div className={"ui dropdown item"} tabIndex={-1} onBlur={e => { if (!e.target.contains(e.relatedTarget)) this.open = false }}>
        <span onMouseDown={() => this.open = !this.open}>
          {icon && <i className={"left floated icon " + icon} />}
          {label}
        </span>
        <div className={"menu transition " + (this.open ? " visible" : "")}>
          <ToolbarItems items={items} />
        </div>
      </div>
    )
  }
}