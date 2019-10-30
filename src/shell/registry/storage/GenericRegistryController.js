import { Controller, expose, command } from "~/lib/Controller";

export class GenericRegistryController extends Controller {
  @command
  async save({key,value}){}

  @command
  async load({key,value}){}
}
