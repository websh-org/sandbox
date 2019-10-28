import React from "react";

export function DataList({data,id,className=""}) {
  data = JSON.parse(JSON.stringify(data));
  className += " ui list";
  const render = (data) => {
    switch (typeof data) {
      case 'function': 
      case 'undefined': return null;
      case "object": 
        if (!data) return String(data);
        if (isArrayLike(data)) return <div className={className}>{[...data].map((d,k)=><DataList data={d} key={k} />)}</div>
        if (data.constructor !== Object) return data.constructor.name || null;
        return <div className={className} >{Object.keys(data).map((k)=><DataList data={data[k]} key={k} id={k}/>)}</div>
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

function isArrayLike(a){
  return (
   a!=null &&
   typeof(a[Symbol.iterator])==='function' &&
   typeof(a.length)==='number' &&
   typeof(a)!=='string'
  );
 }