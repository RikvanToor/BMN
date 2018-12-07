import {isUndefined} from '@Utils/TypeChecks.js'

export function format(str, ...args){
  console.log(args);
  console.log(str);
  return str.replace(/{(\d+)}/g, (match,number)=>{
    console.log(match);
    console.log('Num:'+number);
    return isUndefined(args[number]) ? match: args[number];
  });
}
/**
 * Returns a substring delimited by the given character
 * @param {string} string The string to look in
 * @param {integer} start The index to start the search from
 * @param {char} delim The delimiter
 * @returns Object containing the substring under 'str' and the index of the delimiter under 'ind', 
 *  or -1 at 'ind' if the delimiter was not found.
 */
export function delimSubstring(string, start, delim){
  for(let i = start; i < string.length; i++){
    if(string[i] === delim){
      return {str:string.substring(start,i), ind: i};
    }
  }
  return {str:'',ind:-1};
}