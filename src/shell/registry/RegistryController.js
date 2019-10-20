import {RegistryLocalStorageController} from "./storage/RegistryLocalStorageController";

export const registryTypes = {
  "local-storage": RegistryLocalStorageController
}

export function RegistryController({storage,...rest}) {
  return registryTypes[storage](rest);
}