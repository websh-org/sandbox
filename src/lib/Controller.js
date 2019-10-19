import { uuid } from "../lib/utils";

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
    if (parent) parents.set(this,parent);
    this._handlers = {};
    this._actions = {};
    const { $id } = this.constructor;
    if ($id) Object.defineProperty(this, $id, {
      value: rest[$id] || uuid(),
      writable: false
    })
    this.self = this;
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

  _trigger(type,data={}) {
    const event = new ControllerEvent({type,data,target:this});
    const handlers = this._handlers[type]
    if (handlers) {
      for (var handler of handlers) {
        handler.call(this,event,event.data);
        if (event.isAborted) break;
      }
    }
    if (!event.isStopped && parents.has(this)) {
      parents.get(this)._trigger(this)
    }
  }

  
  assert(cond, msg, details) {
    if (cond) return;
    console.log(this.constructor.name, msg,details)
    throw new Error(msg);
  }
}

export function Controller(Class) {
  const actions = Object.assign({},ControllerStore.$actions||{});
  class Store extends Class {
    constructor(args={}) {
      super(args);
      if (Class.hasOwnProperty("$actions")) {
        Object.assign(this._actions,Class.$actions)
      }
    }
  }
 
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
        if (typeof prop === "string" && prop.startsWith("_")) return undefined;
        const value = Reflect.get(store, prop, store);
        if (typeof value === "function" && !value.isController) return value.bind(store);
        return value;
      },
      set(target, prop, value) {
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

const stores = new WeakMap();
