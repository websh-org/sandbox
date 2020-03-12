/**
 * This is the main base class for all WebShell components.
 * 
 * To define a component:
 * export class Component extends Controller {
 *  
 *    privateProp = "foo";
 *  
 *    @expose publicProp ="bar"
 * 
 *    privateMethod() {
 *    }
 * 
 *    @command async "my-command" ({...args}) {
 *      return this.privateMethod(this.privateProp this.publicProp);
 *    }
 * }
 * 
 * To use a component:
 * 
 * const component = Component.create({...})
 * const bar = component.publicProp
 * await component("my-command",{...})
 * const foo = component.privateProp // throws an error
 * 
 */

import { translate, uuid } from "../utils";
import { ControllerError } from "./ControllerError";
import { action } from "mobx"
import { callProxy, exposedProxy } from "./createProxy";

translate({
  'error:internal-error': "Unhandled internal error.",
  'error:internal-error:message': "{message}",
  'error:bad-command': "No such command.",
  'error:bad-command:message': "{controller}({command}) is not a known command."
})


export class Controller {
  static $id = "id";
  isController = true;

  @expose
  exposed = exposedProxy(this);;

  constructor({ ...rest }) {
    this._commands = Object.assign({}, this._commands)
    this._expose = Object.assign({}, this._expose)
    

    const { $id } = this.constructor;
    if ($id) Object.defineProperty(this, $id, {
      value: rest[$id] || uuid(),
      writable: false,
      configurable: false
    })
  }

  assert(cond, code = "assertion-failed", data = {}) {
    if (!cond && process.env.NODE_ENV != "production") debugger;
    if (!cond) this.throw({ code, data });

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
    return callProxy(this, args);
  }

  async call(command, args = {}) {
    this.assert(this._commands[command], "bad-command", { 
      command, controller: this.constructor.name
    });
    try {
      return await this._commands[command].execute.call(this, args);
    } catch (error) {
      this.catch(new ControllerError(error));
    }
  }

  
}


export class ControllerApi extends Controller {
  constructor({controller, name,...rest}) {
    super(rest);
    this.controller = controller;
    //controller.api[name] = this;
    for (var name in this._commands) {
      const {execute,...rest} = this._commands[name];
      installCommand(controller,name,{
        ...rest,
        execute: (params) => {
          return execute.call(this,{controller,...params})  
        }        
      });
    }
  }
}


function installCommand(obj, prop, value) {
  obj._commands = Object.assign({}, obj._commands, { [prop]: value })
}

export function command(obj, prop, desc) {
  var value = desc.initializer ? desc.initializer() : desc.value;
  if (typeof value === "function") value = { execute: value }
  value.execute = action(value.execute);
  return { initializer() {
    installCommand(obj,prop,value);
    return undefined;
  }}
}


export function expose(obj, prop, desc) {
  obj._expose = Object.assign({}, obj._expose, { [prop]: true })
  return desc;
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

const AsyncFunction = Reflect.getPrototypeOf(async function () { }).constructor;


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
