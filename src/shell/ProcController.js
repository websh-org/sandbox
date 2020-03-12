import { AppController } from "./proc/AppController";
import { WebController } from "./proc/WebController";
import { LocalController } from "./proc/LocalController";
import { FsController } from "./proc/FsController";
import { parseWebShellURI } from "~/lib/utils";

export const procTypes = {
  'app': AppController,
  'web': WebController,
  'fs': FsController,
  'local': LocalController
}

export const ProcController = {
  create({uri,...rest}) {
    const {type,locator} = parseWebShellURI(uri);
    return procTypes[type].create({type,locator,...rest});
  }
}

