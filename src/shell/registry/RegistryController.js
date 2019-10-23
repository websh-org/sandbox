import {RegistryLocalStorageController} from "./storage/RegistryLocalStorageController";

export const registryTypes = {
  "local-storage": RegistryLocalStorageController
}

export class RegistryController {
  static create({storage,...rest}) {
    return registryTypes[storage].create(rest);
  }
}