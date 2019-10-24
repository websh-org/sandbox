import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { uuid } from "~/lib/utils";

const TabContext = React.createContext(null);

@observer
export class ButtonTabs extends React.Component {
  @observable activeTab = this.props.active || null;
  @observable tabs = new Map();
  activate = id => this.activeTab = id;
  render() {
    return (
      <>
        <div className="ui center aligned secondary segment ">
          <div className="ui buttons">
            {[...this.tabs.values()].map(({ id, label, icon }) => (
              <div
                key={id}
                className={"ui button" + (this.activeTab === id ? " active" : "")}
                onClick={() => this.activeTab = id}
              >
                {icon && <i className={icon+" icon"}/> }
                {label}
              </div>
            ))}
           </div>
        </div>
        <div className="ui padded segment sh panes">
          <TabContext.Provider value={{
            activeTab: this.activeTab,
            activate: this.activate,
            mount: (id, tab) => {
              if (!this.props.active && !this.tabs.size) this.activeTab = id;
              this.tabs.set(id, tab);
            },
          }}>
            {this.props.children}
          </TabContext.Provider>
         </div>
      </>
    )
  }
}

@observer
class ButtonTab extends React.Component {
  constructor(props,...rest) {
    super(props, ...rest)
    this.id = props.id || uuid();
  }
  render() {
    return (
      <TabContext.Consumer>
        {({ activeTab, activate, mount }) => {
          const {id} = this;
          const { label, children } = this.props;
          const cls = activeTab === id ? " active" : "";
          return (<>
            <MountTab mount={() => mount(id, { ...this.props, id })} id={id} />
            <div className={"pane" + cls}>
              {this.props.children}
            </div>
          </>)
        }}

      </TabContext.Consumer>
    )
  }
}
@observer class MountTab extends React.Component {
  componentDidMount() {
    this.props.mount()
  }
  render() {
    return null;
  }
}

ButtonTabs.Tab = ButtonTab;