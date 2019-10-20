import React from "react";

export function AppIcon({ url }) {
  return <div className="sh app-icon" style={{backgroundImage:`url(${url})`}}/>
}