import { computed } from "mobx";

export class MenuItem {

  constructor(def, ctx, ...args) {
    this._def = def;
    this._resolve = function(value) {
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

  @computed get execute() {
    if (this._def.execute) return this._bind(this._def.execute);
    if (this._def.action) return this._bind(function(...args) { this.action(args[args.length-1])})
  }

  @computed get available() {
    if (!("available") in this._def) return true;
    return this._resolve(this._def.available)
  }

  @computed get items() {
    if (!("items") in this._def) return;
    const items = this._resolve(this._def.items);
    if (items) {
      return items.map(it => this._item(it));
    }
  }
  @computed get label() {
    return this._resolve(this._def.label)
  }

  @computed get icon() {
    return this._resolve(this._def.icon)
  }
}