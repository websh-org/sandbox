import React from "react";

export function AppIcon({ url, size="regular" }) {
  return <div className={"sh app-icon "+size} style={{backgroundImage:`url(${url})`}}/>
}