/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export function intRange(start, exclusiveEnd, step = 1){
  let arr = [];
  for(let i = start; i < exclusiveEnd; i+= step){
    arr.push(i);
  }
  return arr;
}