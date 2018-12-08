export function withKeys(obj, keys){
    return keys.reduce((accum,key)=>{
        accum[key] = obj[key];
        return accum;
    },{});
}