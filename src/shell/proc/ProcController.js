import { AppController } from "./AppController";
import { WebController } from "./WebController";
import { LocalController } from "./LocalController";

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