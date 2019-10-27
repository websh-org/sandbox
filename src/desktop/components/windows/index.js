import { IframeWindow } from "./IframeWindow";
import { LocalWindow } from "./LocalWindow";

export { localWindows } from "./local"

export const windowTypes = {
  'app': IframeWindow,
  'web': IframeWindow,
  'local': LocalWindow
}

