
export function isObject(data){
    return typeof data === 'object';
}
export function isString(data){
    return typeof data === 'string';
}
export function isNumber(data){
    return typeof data === 'number';
}
export function isBoolean(data){
    return typeof data === 'boolean';
}
export function isUndefined(data){
    return typeof data === 'undefined';
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