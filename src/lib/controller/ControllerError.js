
export class ControllerError {
  constructor(error) {
    //    if (!error) debugger;
    if (error instanceof ControllerError) return error;
    if (error instanceof Error) {
      this.code = "internal-error";
      const message = String(error);
      this.data = { message }
      this.originalError = error;
    } else {
      //      if (!error) debugger;
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



