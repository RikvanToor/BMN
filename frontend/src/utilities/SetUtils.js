
/**
 * Adds the elements of set2 to set1, where set1 is modified in place.
 * @param {Set} set1 First set
 * @param {Set} set2 Second set
 */
export function unionIn(set1, set2){
    for(var el of set2){
        set1.add(el);
    }
    return set1;
}