import { Controller } from "./Controller";
import { ControllerEvent } from "./ControllerEvent";

const parents = new WeakMap;

export class EventController extends Controller {
  static $id = "id";
  isController = true;


  constructor({ parent, ...rest }) {
    if (parent) parents.set(this, parent);
    this._handlers = {};
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
}

