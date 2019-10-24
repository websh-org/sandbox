import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import { Dialog } from "./Dialog";
import { T } from "~/lib/utils";

@observer
export class ErrorDialog extends React.Component {
  @observable value;


  render() {
    const { dialog, resolve, resolver, reject, data } = this.props;
    const { error } = data;
    return (
      <Dialog dialog={dialog} icon="question" title="Error">
        <div className="ui padded  segment">
          <div className="ui error icon message">
          <i className="red ban icon"></i>
          <div className="content">
            <div className="header">{T("error",error.code)}</div>
            <p>{T("error",error.code,"message",error.data)}</p>
            <details>
              <summary class="ui label">Details</summary>
            <div className="ui list">
              <DataToList data={error.data} id="Error Data"/>
            </div>
            </details>
          </div>
          </div>
        </div>
        <div className="ui basic secondary right aligned segment">
            <a className="ui orange button" onClick={resolver()}>Close</a>
        </div>
      </Dialog>
    );
  }
}


function DataToList({data,id}) {

    function isArrayLike(a){
      
     return (
      a!=null &&
      typeof(a[Symbol.iterator])==='function' &&
      typeof(a.length)==='number' &&
      typeof(a)!=='string'
     );
    }

  data = JSON.parse(JSON.stringify(data));

  const render = (data) => {
    switch (typeof data) {
      case 'function': 
      case 'undefined': return null;
      case "object": 
        if (!data) return String(data);
        if (isArrayLike(data)) return <div className="ui list">{[...data].map((d,k)=><DataToList data={d} key={k} />)}</div>
        if (data.constructor !== Object) return data.constructor.name || null;
        return <div className="ui list">{Object.keys(data).map((k)=><DataToList data={data[k]} key={k} id={k}/>)}</div>
      default: 
        return String(data);
    }
  }

  return (
    <div className="item">
      {id && <b>{id}</b>} {render(data)}
    </div>
  )
}