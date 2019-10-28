import { translate, uuid  } from "../lib/utils";
import { ControllerError } from "./ControllerError";
import { action } from "mobx"
import { reject } from "q";

translate({
  'error:bad-command' : "No such command.",
  'error:bad-command:message': "{controller}({command}) is not a known command."
})

const parents = new WeakMap;

class ControllerEvent {
  isStopped = false;
  isPrevented = false;
  isAborted = false;

  constructor({ target, type, data }) {
    this.type = type;
    this.target = target;
    this.data = Object.assign({}, data);
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

export class Controller {
  static $id = "id";
  isController = true;

  constructor({ parent, ...rest }) {
    this._internal = Object.assign({}, this._internal)
    this._readonly = Object.assign({}, this._readonly)
    this._actions = Object.assign({}, this._actions)
    this._state = Object.assign({}, this._state)

    if (parent) parents.set(this, parent);
    this._handlers = {};
    const { $id } = this.constructor;
    if ($id) Object.defineProperty(this, $id, {
      value: rest[$id] || uuid(),
      writable: false,
      configurable: false
    })
  }

  on(type, handler) {
    if (!this._handlers[type]) {
      this._handlers[type] = new Set([handler])
    } else {
      this._handlers[type].add(handler);
    }
  }

  off(type, handler) {
    if (!this._handlers[type]) return;
    this._handlers[type].delete(handler);
  }

  _dispatch(event) {
    const { type, data, target } = event;
    const handlers = this._handlers[type]
    if (handlers) {
      for (var handler of handlers) {
        handler.call(this, event, data);
        if (event.isAborted) break;
      }
    }
    if (!event.isStopped && parents.has(this)) {
      parents.get(this)._dispatch(event)
    }
  }

  _trigger(type, data = {}) {
    const event = new ControllerEvent({ type, data, target: this.action });
    this._dispatch(event);
  }

  assert(cond, code="assertion-failed",data={}) {
    if (!cond && process.env.NODE_ENV!="production") debugger;
    if (!cond) this.throw({code,data});

  }
  throw(code, data, message) {
    if (typeof code == "string") {
      code = { code, data, message }
    }
    const error = new ControllerError(code)
    error.source = error.source || this;
    throw error;
  }

  catch(error) {
    this.throw(error);
  }

  static create(args) {
    return create(this, args);
  }
}

export function state(obj, prop, desc) {
  obj._state = Object.assign({}, obj._state, { [prop]: true })
  return desc;
}

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
  return { value: undefined };
}

command.errors = function (list) {
  return function (obj, prop, desc) {
    var value = desc.initializer ? desc.initializer() : desc.value;
    return command(obj, prop, {
      ...desc, value: tryCatch(obj, value, list)
    })
  }
}

export function errors(list) {
  return function (obj, prop, desc) {
    var value = desc.initializer ? desc.initializer() : desc.value;
    return ({
      ...desc, value: tryCatch(obj, value, list)
    })
  }
}

export function timeout(time, code = "timeout", data = {}) {
  return function (obj, prop, desc) {
    var value = desc.initializer ? desc.initializer() : desc.value;
    return ({
      ...desc, value(...args) {

//        return timeoutPromise(time,value.call(obj,...args),{code,data});

        return new Promise((resolve, reject) => {
          const t = setTimeout(() => {
            console.log('timeout')
            reject(new ControllerError({ code, data }))
          }, time);
          setTimeout(async () => {
            try {
              const res = value.call(this, ...args);
              clearTimeout(t);
              resolve(res);
            } catch (error) {
              reject(new ControllerError(error));
              clearTimeout(t);
            }
          }, 0)
        })
      }
    })
  }
}

export function promise(obj, prop, desc) {
  var value = desc.initializer ? desc.initializer() : desc.value;
  return {
    ...desc,
    value(...args) {
      return new Promise(async (resolve, reject) => {
        await value.call(this, resolve, reject, ...args)
      })
    }
  }
}


function tryCatch(obj, fn, list = {}) {
  if (fn instanceof AsyncFunction) {
    return async function (...args) {
      try {
        const res = await fn.call(this, ...args);
        return res;
      } catch (e) {
        const error = new ControllerError(e);
        if (list[error.code]) {
          try {
            await list[error.code].call(this, { ...error });
          } catch (e) {
            this.throw(new ControllerError(e))
          }
        }
        else this.catch(error);
      }
    }
  } else {
    return function (...args) {
      try {
        return fn.call(obj, ...args)
      } catch (e) {
        const error = new ControllerError(e);
        if (list[error.code]) {
          try {
            list[error.code].call(obj, { ...error });
          } catch (e) {
            obj.throw(new ControllerError(err))
          }
        }
        else obj.catch(error);
      }
    }
  }
}



const AsyncFunction = Reflect.getPrototypeOf(async function () { }).constructor;
class ProxyFunction extends AsyncFunction { };

function create(Store, args) {
  const store = new Store(args);
  const controller = new ProxyFunction("", "");
  Object.defineProperty(controller, 'name', {value: `${Store.name} [${Store.$id}=${store[Store.$id]}]`, writable: false});

  const proxy = new Proxy(controller, {
    async apply(target, thisArg, [command, args, { timeout = 0 } = {}]) {
      store.assert(store._actions[command], "bad-command", { command, controller:Store.name });
      try {
        return await store._actions[command].execute.call(store, args);
      } catch (error) {
        store.catch (new ControllerError(error));
      }
    },
    get(target, prop, receiver) {
      if (prop in controller) return Reflect.get(controller, prop, controller);
      if (prop !== Store.$id && !store._state[prop] && typeof prop === "string") {
        const value = Reflect.get(store, prop, store)
        if (value !== undefined) {
          store.throw(new ControllerError({
            code: "controller-access-violation",
            message: `${Store.name}.${prop} is not readable.`
          }));
        }
        return undefined;
      }
      const value = Reflect.get(store, prop, store);
      if (typeof value === "function" && !(value instanceof ProxyFunction)) return value.bind(store);
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
  store.action = store.call = proxy;
  return proxy;
};

async function timeoutPromise(time,promise,{code="timeout",data={}}) {
  try {
  return await Promise.race(
    promise,
    new Promise(()=>setTimeout(()=>{throw {code,data}}))
  )
  } catch (error) {
    throw new ControllerError(error);
  }
}