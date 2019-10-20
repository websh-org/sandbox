import { Controller, internal, command, readonly } from "~/lib/Controller";

export const GenericRegistryController = Controller(class RegistryControllerStore extends Controller.Store {
  @command
  async save({key,value}){}

  @command
  async load({key,value}){}
})
