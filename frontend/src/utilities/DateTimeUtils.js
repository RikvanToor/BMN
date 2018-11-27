
import * as typeChecks from '@Utils/TypeChecks.js';

/**
 * Converts a Date object to a nicely readable date string.
 * @param {Date} dateObj The date object
 * @returns {string} String representation of the date part of the date.
 */
export function readableDate(dateObj){
  return dateObj.toLocaleDateString('nl-nl', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export function printTime(date){
  return date.toLocaleTimeString('nl-nl', { hour: '2-digit', minute: '2-digit' });
}

export const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Left pad a string
 * @param {string} str The string
 * @param {string} val Padding value
 * @param {int} length Target length. If the string has smaller length, leftpad until this lenght is reached.
 * @returns {string} The padded string
 */
function leftPad(str,val, length){
  if(str.length >= length) 
    return str;
  
  let pad = '';
  for(let i = 0; i < length-str.length; i++){
    pad += val;
  }
  return pad + str;
}

/**
 * Returns a string format for a datetime date that PHP understands
 * @param {Date} date The date to format
 * @returns {String} Formatted string representation of date.
 */
export function toPhpString(date){
  return date.getFullYear() + '-' + 
          leftPad((date.getMonth()+1)+'','0',2) + '-' + 
          leftPad(date.getDate()+'','0',2) + ' ' 
          //Time part
          + leftPad(date.getHours()+'','0',2) + ':' + leftPad(date.getMinutes()+'','0',2);
}

/**
 * Converts the time part of a Date object to a nicely readable time string
 * @param {Date} dateObj The date object
 * @returns {string} String representation of the time part of the date
 */
export function readableTime(dateObj) {
  return dateObj.toLocaleTimeString('nl-nl', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Sets the time on the date to noon.
 * @param {Date} date The date to modify.
 * @returns {Date} The date with noon as time
 */
export function atNoon(date){
  date.setHours(12);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

export function toHoursMinutesInt(date){
  if(typeChecks.isString(date)){
    date = new Date(date);
  }
  return date.getHours() * 100 + date.getMinutes();
}

export function toHoursMinutes(date){
  if(typeChecks.isString(date)){
    date = new Date(date);
  }
  return {h: date.getHours(), m: date.getMinutes()};
}

/**
 * Converts a date to an integer representation of the form YYYYMMDD.
 * @param {Date} date The date
 * @returns {Number} Integer representation of the date
 */
export function intDate(date){
  return date.getYear() * 10000 + date.getMonth() * 100 + date.getDate();
}

/**
 * Creates a new date object with the date of the given date and the time as specified
 * by hours and minutes
 * @param {Date} date The date object from which the year, month and day will be derived
 * @param {int} hours The hours for the time component
 * @param {int} minutes The minutes for the time component
 * @returns {Date} A new date object with the date and time as specified above.
 */
export function dateWithTime(date, hours, minutes){
  return new Date(date.getFullYear(),date.getMonth(), date.getDate(), hours, minutes);
}

/**
 * Sets the hours and minutes for a given date. The time is specified as an integer
 * of the form hhmm.
 * @param {Date} date The date to use
 * @param {int} intTime The time
 * @returns {Date} New date with the time set
 */
export function dateWithIntTime(date, intTime){
  console.log(date);
  const hours = Math.floor(intTime/100);
  const minutes = intTime - hours * 100;
  console.log(date.getYear());
  return new Date(date.getFullYear(),date.getMonth(), date.getDate(), hours, minutes);
}

export function isDateLess(date1, date2){
  return intDate(date1) < intDate(date2);
}

export function isDateGreater(date1, date2){
  return intDate(date1) > intDate(date2);
}

/**
 * Changes the hour of an integer time, represented as an element in [0, 2400) for time
 * @param {int} intTime The original time
 * @param {int} hour The hour
 * @returns {int} The new integer time
 */
export function changeHour(intTime, hour){
  return intTime - Math.floor(intTime / 100) * 100 + hour * 100;
}

/**
 * Changes the minutes of an integer time, represented as an element in [0, 2400) for time
 * @param {int} intTime The original time
 * @param {int} minutes The new minutes
 * @returns {int} The new integer time
 */
export function changeMinutes(intTime, minutes){
  return Math.floor(intTime / 100) * 100 + minutes;
}

export function getDaysInMonth(monthNumber, year){
  let monthLength = daysInMonth[monthNumber];
  if (monthNumber === 1) { //Februari
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      monthLength = 29;
    }
  }
  return monthLength;
}

export function getWeekNumber(dateObj){
  const target  = new Date(dateObj.valueOf());
  const dayNr   = (dateObj.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000);
}

export function dateOnlyFromISO(isoString){
  return new Date(`${isoString.slice(0,10)}T12:00:00.000Z`);
}