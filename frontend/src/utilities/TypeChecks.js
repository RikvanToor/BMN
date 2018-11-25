
export function isObject(data){
    return typeof data === 'object';
}
export function isString(data){
    return typeof data === 'string';
}
export function isNumber(data){
    return typeof data === 'number';
}
export function isEmptyString(data){
  return isString(data) && data.length === 0;
}
export function isBoolean(data){
    return typeof data === 'boolean';
}
export function isUndefined(data){
    return typeof data === 'undefined';
}
export function isDate(o){
  return o instanceof Date;
}
/**
 * Returns whether the given object is a plain old javascript object
 * @param {mixed} o Element
 * @returns {Boolean} Whether it is a POJO
 */
export function isPOJO(o){
  return Object(o) === o && Object.getPrototypeOf(o) === Object.prototype;
}
export function isFunction(data){
    return typeof data === 'function';
}
export function isArray(data){
    return Array.isArray(data);
}
export function hasKeys(obj, keys){
    let set = new Set(keys);
    for(var prop in Object.keys(obj)){
        set.delete(prop);
    }
    return set.size === 0;
}
export function expectHasKeys(obj, keys){
    let set = new Set(keys);
    Object.keys(obj).forEach(prop=>{
        set.delete(prop);
    });
    if(set.size !== 0){
        console.log(set);
        console.log(obj);
        return false;
    }
    return true;
}