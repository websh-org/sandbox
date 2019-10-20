import React from "react";

export function Icon({ icon="", image, onClick }) {
  if (image) return <i className={"icon "+icon} style={{ backgroundImage: `url(${image})` }} onClick={onClick}/>
  else return <i className={"icon " + icon} onClick={onClick}/>
}