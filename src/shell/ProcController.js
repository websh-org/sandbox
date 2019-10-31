import { AppController } from "./proc/AppController";
import { WebController } from "./proc/WebController";
import { LocalController } from "./proc/LocalController";

export const procTypes = {
  'app': AppController,
  'web': WebController,
  'local': LocalController
}

export const ProcController = {
  create({type,...rest}) {
    return procTypes[type].create({type,...rest});
  }
}

