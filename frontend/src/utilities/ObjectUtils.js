/**
 * Create a new object based on the original object, but with
 * the given keys. If a key is an array, the first element should
 * be the new key, whereas the second is the key on the original object
 * @param {object} obj The object to take data from 
 * @param {array} keys Array of keys, either a string, or a lenght 2 array of strings [newKey, oldKey]
 * @returns object The new object with the specified keys.
 */
export function withKeys(obj, keys){
    let newObj = {};
    keys.forEach((key)=>{
        if(Array.isArray(key) && key.length == 2){
            newObj[key[0]] = obj[key[1]];
        }
        else{
            newObj[key] = obj[key];
        }
    });
    return newObj;
}