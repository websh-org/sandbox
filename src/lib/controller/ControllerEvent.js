export class ControllerEvent {
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