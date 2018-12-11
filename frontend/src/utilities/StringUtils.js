import {isUndefined} from '@Utils/TypeChecks.js'

export function format(str, ...args){
  return str.replace(/{(\d+)}/g, (match,number)=>{
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

export function replace(string, loc, char){
  if(loc == 0){
    return char + string.slice(1);
  }
  else if(loc == string.length){
    return string.slice(0,string.length-1) + char;
  }
  return string.slice(0,loc) + char + string.slice(loc+1);
}
export function leftPad(string, length, char){
  if(string.length < length){
    return char.repeat(length-string.length) + string;
  }
  return string;
}