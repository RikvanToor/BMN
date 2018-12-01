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