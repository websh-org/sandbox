import { computed } from "mobx";

export class MenuItem {

  constructor(def, ctx, ...args) {
    this._def = def;
    this._resolve = function(prop,_default) {
      if (!(prop in this._def)) return _default;
      const value = this._def[prop];
      if (typeof value !== "function") return value;
      return value.apply(ctx,args);
    }
    this._item = function(it) {
      return new MenuItem(it, ctx,...args)
    }

    this._bind = function(fn,...params) {
      return fn.bind(ctx,...args,...params)
    }
  }


  
  @computed get type() {
    return this._def.type;
  }

  @computed get execute() {
    const {execute,command} = this._def;
    if (execute) return this._bind(execute);
    if (command) {
      const params = this._resolve("params",{});
      return this._bind(async function(...args) { 
        var res = await this.call(command, params);
        return res;
      });    
    }
  }

  @computed get available() {
    return this._resolve("available",true)
  }

  @computed get items() {
    const items = this._resolve("items");
    if (items) {
      return items.map(it => this._item(it));
    }
  }
  @computed get label() {
    return this._resolve("label")
  }

  @computed get order() {
    return this._resolve("order",null)
  }
  
  @computed get icon() {
    return this._resolve("icon")
  }
}