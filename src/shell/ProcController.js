import { AppController } from "./proc/AppController";
import { WebController } from "./proc/WebController";
import { LocalController } from "./proc/LocalController";
import { parseWebShellURI } from "~/lib/utils";

export const procTypes = {
  'app': AppController,
  'web': WebController,
  'local': LocalController
}

export const ProcController = {
  create({uri,...rest}) {
    const {type,locator} = parseWebShellURI(uri);
    return procTypes[type].create({type,locator,...rest});
  }
}

