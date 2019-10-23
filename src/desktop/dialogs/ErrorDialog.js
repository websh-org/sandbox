import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import { Dialog } from "./Dialog";

@observer
export class ErrorDialog extends React.Component {
  @observable value;


  render() {
    const { dialog, resolve, resolver, reject, data } = this.props;
    const { error } = data;
    return (
      <Dialog dialog={dialog} icon="question" title="Unhandled error">
        <div className="ui padded  segment">
          <div className="ui error icon message">
          <i className="red ban icon"></i>
          <div className="content">
            <div className="header">{error.code}</div>
            <p>{error.message}</p>
            <ul className="ui list">
              <DataToList data={error.data} id="Error Data"/>
            </ul>
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
      console.log(typeof a,a)
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
        if (isArrayLike(data)) return <ul>{[...data].map((d,k)=><DataToList data={d} key={k} />)}</ul>
        if (data.constructor !== Object) return data.constructor.name || null;
        return <ul>{Object.keys(data).map((k)=><DataToList data={data[k]} key={k} id={k}/>)}</ul>
      default: 
        return String(data);
    }
  }

  return (
    <li>
      {id && <b>{id}</b>} {render(data)}
    </li>
  )
}