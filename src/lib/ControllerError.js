
export class ControllerError {
  constructor(error) {
    if (error instanceof ControllerError) return error;
    if (error instanceof Error) {
      this.code = "internal-error";
      this.message = error.message || "Internal Error";
      this.data = {}
      this.originalError = error;
    } else {
      this.code = error.code || "internal-error";
      this.message = error.message || error.code || "Internal Error";
      this.data = error.data || {};
      this.originalError = error;
    }
  }
  toString() {
    return `[${this.code}] ${this.message}`
  }
}
