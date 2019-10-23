import Ajv from "ajv";
const ajv = new Ajv();

const uuidPattern = "" + 1e7 + -1e3 + -4e3 + -8e3 + -1e11;

export function uuid() {
  const r = [...crypto.getRandomValues(new Uint8Array(32))];
  return uuidPattern.replace(/[018]/g, c =>
    (c ^ (r.pop() & (15 >> (c / 4)))).toString(16)
  );
}

export function invalidator(jsonSchema) {
  const validate = ajv.compile(jsonSchema);
  return (...args) => {
    if (validate(...args)) return false;
    else return validate.errors.map(({ dataPath, message }) => `${dataPath || "(root)"}: ${message}`);
  }
}
