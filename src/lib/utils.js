import Ajv from "ajv";
import { ControllerError } from "./controller/ControllerError";

const translations = {};
const uuidPattern = "" + 1e7 + -1e3 + -4e3 + -8e3 + -1e11;

export function uuid() {
  const r = [...crypto.getRandomValues(new Uint8Array(32))];
  return uuidPattern.replace(/[018]/g, c =>
    (c ^ (r.pop() & (15 >> (c / 4)))).toString(16)
  );
}

const ajv = new Ajv();
export function invalidator(jsonSchema) {
  const validate = ajv.compile(jsonSchema);
  return (...args) => {
    if (validate(...args)) return false;
    else return validate.errors.map(({ dataPath, message }) => `${dataPath || "(root)"}: ${message}`);
  }
}

export function T(...ids) { 
  const data = typeof ids[ids.length-1] === 'object' ? ids.pop() : {};
  const id = ids.join(":");
  const trans = translations[id];
  if (!trans) return id;
  return trans.replace(/\{\s*([\-\w]+)\s*\}/g,(_,$1) =>  ($1 in data) ? data[$1] : "{" + $1 + "}")
  return translations[ids.join(":")] || ids.join(":") 
};

export function translate(id,def) {
  if (typeof id==='object') {
    for (const i in id) translate(i,id[i]);
    return;
  }
  if (id in translations) throw {code:"duplicate-translation", data:{id}}
  translations[id] = def;
}

translate({
  "error:bad-uri": "URI failed to parse",
  "error:bad-uri:message": "{uri} is not a valid WebShell URI: {reason}"
})

export function parseWebShellURI(uri) {
  try {
    const url1 = new URL(uri);
    if (url1.protocol!=="webshell:") throw new Error("Must be prefixed with webshell:")
    const uri2 = url1.pathname+(url1.query||"")+(url1.hash||"");
    const url2 = new URL(uri2);
    const type = url2.protocol.slice(0,-1);
    const locator = url2.pathname+(url2.query||"")+(url2.hash||"");
    return {type,locator}
  } catch (error) {
    throw new ControllerError({code:"bad-uri",data:{reason:String(error),uri}})
  }
}

export const requestIdle = window.requestIdleCallback || ( fn=>setTimeout(fn,10) )



