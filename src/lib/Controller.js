import { uuid } from "../lib/utils";

import { action } from "mobx"

const parents = new WeakMap;

class ControllerEvent {
  isStopped = false;
  isPrevented = false;
  isAborted = false;
  
  constructor({target,type,data}) {
    this.type = type;
    this.target = target;
    this.data = Object.assign({},data);
  }

  stop() {
    this.isStoped = true;
  }
  prevent() {
    this.isPrevented = true;
  }
  abbort() {
    this.isAborted = true;
  }
}

class ControllerStore {
  static $id = "id";
  isController = true;

  constructor({ parent, ...rest }) {
    this._internal = Object.assign({},this._internal)
    this._readonly = Object.assign({},this._readonly)
    
    this._actions = Object.assign({},this._actions)
    if (parent) parents.set(this,parent);
    this._handlers = {};
    const { $id } = this.constructor;
    if ($id) Object.defineProperty(this, $id, {
      value: rest[$id] || uuid(),
      writable: false
    })
  }

  on(type,handler) {
    if (!this._handlers[type]) {
      this._handlers[type] = new Set([handler])
    } else {
      this._handlers[type].add(handler);
    }
  }

  off(type,handler) {
    if (!this._handlers[type]) return;
    this._handlers[type].delete(handler);
  }

  _dispatch(event) {
    const {type,data,target}=event;
    const handlers = this._handlers[type]
    if (handlers) {
      for (var handler of handlers) {
        handler.call(this,event,data);
        if (event.isAborted) break;
      }
    }
    if (!event.isStopped && parents.has(this)) {
      parents.get(this)._dispatch(event)
    }
  }

  _trigger(type,data={}) {
    const event = new ControllerEvent({type,data,target:this.action});
    this._dispatch(event);
  }

  @internal
  assert(cond, ...args) {
   if (!cond) this.throw(...args);

  }
  @internal
  throw(error,data,message) {
    if (typeof error=="string") {
      error = {error,data,message}
    } 
    throw new ControllerError(error)
  }

}

class ControllerError extends Error {
  constructor({error,message,data={}}) {
    super(error||message)
    this.error = error || "internal-error";
    this.message = message || error || "Internal Error";
    this.data = data;
  }
}


export function Controller(Store) {
   
  const factory = function (args) {   
    const store = new Store(args);
    const controller = function(){};
    const pub = new Proxy(controller, {
      apply(target, thisArg, [action, ...args]) {
        try {
          store.assert(store._actions[action], "bad-action",{action});
          return store._actions[action].execute.call(store, ...args);
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
      get(target, prop, receiver) {
        if (prop in controller) return Reflect.get(controller, prop);
        if (store._internal[prop]) return undefined;
        if (store._actions[prop]) return undefined;
        if (typeof prop === "string" && prop.startsWith("_")) return undefined;
        const value = Reflect.get(store, prop, store);
        if (typeof value === "function" && !value.isController) return value.bind(store);
        return value;
      },
      set(target, prop, value) {
        if (store._internal[prop]) return undefined;
        if (store._readonly[prop]) return undefined;
        if (typeof prop === "string" && prop.startsWith("_")) return undefined;
        if (prop in store) return Reflect.set(store, prop, store);
        store.assert(false, "bad-prop-" + prop);
      }
    });
    store.action = pub;
    return pub;
  };
  factory.isFactory = true;
  factory.Store = Store;
  return factory;
}

Controller.Store = ControllerStore;

export function internal(obj, prop, desc) {
  obj._internal = Object.assign({}, obj._internal, { [prop]: true })
  return desc;
}

export function readonly(obj, prop, desc) {
  obj._readonly = Object.assign({}, obj._readonly, { [prop]: true })
  return desc;
}

export function command(obj, prop, desc) {
  var value = desc.initializer ? desc.initializer() : desc.value;
  if (typeof value === "function") value = { execute: value }
  value.execute = action(value.execute);
  obj._actions = Object.assign({}, obj._actions, { [prop]: value })
  return {value:undefined};
}