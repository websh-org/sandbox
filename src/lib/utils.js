const uuidPattern = "" + 1e7 + -1e3 + -4e3 + -8e3 + -1e11;

export function uuid() {
  const r = [...crypto.getRandomValues(new Uint8Array(32))];
  return uuidPattern.replace(/[018]/g, c =>
    (c ^ (r.pop() & (15 >> (c / 4)))).toString(16)
  );
}


export function getter(obj,_prop,descriptor) {
  if(!_prop.startsWith("_")) throw new Error("@getter only works on prop names starting with _");
  const prop=_prop.substr(1);
  Object.defineProperty(obj,prop,{
    get() {
      return this[_prop];
    }
  })
  return descriptor;
}