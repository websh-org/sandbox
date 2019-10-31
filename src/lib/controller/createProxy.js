import { ControllerError } from "./ControllerError";


const AsyncFunction = Reflect.getPrototypeOf(async function () { }).constructor;
class ProxyFunction extends AsyncFunction { };

export function callProxy (Store, args) {
  const store = new Store(args);
  const controller = new ProxyFunction("", "");
  Object.defineProperty(controller, 'name', {value: `${Store.name} [${Store.$id}=${store[Store.$id]}]`, writable: false});

  const proxy = new Proxy(controller, {
    async apply(target, thisArg, [command, params, { timeout = 0 } = {}]) {
      return await store.call(command,params)
    },
    get(target, prop, receiver) {
      if (prop in receiver) return Reflect.get(receiver, prop);
      if (prop !== Store.$id && !store._expose[prop] && typeof prop === "string") {
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
      return undefined;
    }
  });
  // store.action = store.call = proxy;
  return proxy;
};

export function exposedProxy (store) {
  const Store = store.constructor;
  const controller = new ProxyFunction("", "");
  Object.defineProperty(controller, 'name', {value: `${Store.name} [${Store.$id}=${store[Store.$id]}]`, writable: false});

  const proxy = new Proxy(controller, {
    async apply(target, thisArg, [command, params, { timeout = 0 } = {}]) {
      throw "Cannot call as function."
    },
    get(target, prop, receiver) {
      if (prop in receiver) return Reflect.get(receiver, prop);
      if (prop !== Store.$id && !store._expose[prop] && typeof prop === "string") {
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
      return undefined;
    }
  });
  // store.action = store.call = proxy;
  return proxy;
};
