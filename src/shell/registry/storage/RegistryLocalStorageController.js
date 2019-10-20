import { Controller, internal, command, readonly } from "~/lib/Controller";
import { GenericRegistryController} from "./GenericRegistryController"

export const RegistryLocalStorageController = Controller(class RegistryLocalStorageControllerStore extends GenericRegistryController.Store {
  @command
  async save({key,value}){
    localStorage.setItem("shell_registry_"+key,JSON.stringify(value))
  }

  @command
  async load({key,initial=null}){
    try {
      return JSON.parse(localStorage.getItem("shell_registry_"+key)) || initial;
    } catch (error) {
      return initial
    }
  }
})