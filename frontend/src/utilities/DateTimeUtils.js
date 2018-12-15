
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
function clamp(val, min, max){
  if(val < min) return min;
  if(val > max) return max;
  return val;
}

export class IntegerTime{
  constructor(h =0, m =0){
    this.h = clamp(h, 0, 24);
    this.m = clamp(m, 0, 59);
  }
  /**
   * Returns the time in army time format 'hhmm'.
   * @return integer The army time
   */
  toArmyTime(){
    return 100 * this.h + this.m;
  }
  toReadableTime(wrap = true){
    let hours = this.h > 23 && wrap ? this.h - 24 * Math.floor(this.h/24) : this.h;
    hours = hours < 10 ? '0' + hours : hours;
    let minutes = this.m < 10 ? '0' + this.m : this.m;
    return hours + ':' + minutes;
  }
  static compare(date1, date2){
    if(date1.lessThan(date2)) return -1;
    else if(date1.greaterThan(date2)) return 1;
    return 0;
  }
  static fromArmyTime(armyTime){
    let h = Math.floor(armyTime/100);
    let m = armyTime - 100 * h;
    return new IntegerTime(h,m);
  }
  static fromDate(dateObj){
    return new IntegerTime(dateObj.getHours(), dateObj.getMinutes());
  }
  static fromDateString(str){
    return IntegerTime.fromDate(new Date(str));
  }
  /**
   * Creates a new time from relative steps.
   * @param {integer} steps Number of steps 
   * @param {IntegerTime} start Start time after which to count the steps 
   * @param {integer} stepSize Size of a step in minutes 
   */
  static fromRelativeSteps(steps, start, stepSize){
    let minutes = stepSize * steps;
    return start.copy().addMinutes(minutes);
  }
  /**
   * @return IntegerTime Returns a copy of this object.
   */
  copy(){
    return new IntegerTime(this.h, this.m);
  }
  addMinutes(minutes){
    let newM = minutes + this.m;
    let hours = Math.floor(newM / 60);
    this.h += hours;
    this.m += newM - 60 * hours;
    return this;
  }
  /**
   * Returns minute difference between this time and the next
   * @param {IntegerTime} other 
   */
  minuteDiff(other){
    let hDiff = this.h - other.h;
    let mDiff = this.m - other.m;
    return hDiff * 60 + mDiff;
  }
  toMinutes(){
    return this.m + 60 * this.h;
  }
  /**
   * Converts the time to a date object, specified by a Date object
   * as first argument, or the year, month, day integers (y,m,d).
   * @param {Date|integer|string} yOrDate Year integer, date string or Date object 
   * @param {integer} m 
   * @param {integer} d 
   */
  toDate(y, m, d){
    if(y instanceof Date){
      let date = new Date(y.getTime());
      date.setHours(this.h);
      date.setMinutes(this.m);
      return date;
    }
    else if(typeof y === 'string'){
      let date = new Date((new Date(y)).getTime());
      date.setHours(this.h);
      date.setMinutes(this.m);
      return date;
    }
    return new Date( y, m, d, this.h, this.m );
  }
  toRelativeSteps(startTime, stepSize){
    let mins = this.toMinutes();
    if(typeChecks.isNumber(startTime)){
      return Math.floor((mins-startTime)/stepSize);
    }
    //Assume IntegerTime
    else{
      return Math.floor((mins-startTime.toMinutes())/stepSize);
    }
  }
  copyFrom(other){
    this.h = other.h;
    this.m = other.m;
  }
  lessThan(other){
    return this.h < other.h || (this.h == other.h && this.m < other.m);
  }
  greaterThan(other){
    return this.h > other.h || (this.h == other.h && this.m > other.m);
  }
  lessThanEqual(other){
    return !this.greaterThan(other);
  }
  greaterThanEqual(other){
    return !this.lessThan(other);
  }
  equals(other0){
    return this.h == other.h && this.m == other.m;
  }
  isMidnight(){
    return this.h == 0 && this.m == 0;
  }
}

/**
 * Represents an interval of integer times
 */
export class IntegerTimeInterval{
  constructor(start, end, midnightIsHighest = false){
    this.midnightIsHighest = midnightIsHighest;
    this.check(start,end);
    this.start = start;
    this.end = end;
  }
  /**
   * Clamps the given object to this interval in place. Note that
   * an IntegerTimeInterval may collapse if it is outside this interval.
   * @param {IntegerTime|IntegerTimeInterval} object 
   */
  clamp(object){
    if(object instanceof IntegerTime){
      if(object.lessThan(this.start)){
        object.copyFrom(this.start);
      }
      else if(object.greaterThan(this.end)){
        object.copyFrom(this.end);
      }
    }
    else if(object instanceof IntegerTimeInterval){
      this.clamp(object.start);
      this.clamp(object.end);
    }
  }
  /**
   * Copies the object
   * @return A copy of this interval
   */
  copy(){
    return new IntegerTimeInterval(this.start.copy(), this.end.copy());
  }

  static fromDateString(start, end){
    return new IntegerTimeInterval(IntegerTime.fromDate(new Date(start)), IntegerTime.fromDate(new Date(end)));
  }
  static fromArmyTime(start, end){
    return new IntegerTimeInterval(IntegerTime.fromArmyTime(start), IntegerTime.fromArmyTime(end));
  }
  check(start, end){
    if(start.greaterThan(end)){
      if(end.isMidnight() && !this.midnightIsHighest){
        throw new Error("IntegerTimeInterval is not properly ordered: start > end");
      }
    }
  }
  /**
   * Returns the time span in minutes
   */
  span(){
    return this.end.toMinutes() - this.start.toMinutes();
  }
  
  /**
   * Returns whether a time is contained in this interval
   * @param {IntegerTime} time 
   */
  contains(time, ignoreEndPoints = false){
    if(ignoreEndPoints){
      return this.start.lessThan(time) && this.end.greaterThan(time);
    }
    else{
      return this.start.lessThanEqual(time) && this.end.greaterThanEqual(time);
    }
  }
  set(start, end){
    this.check(start,end);
    this.start = start;
    this.end = end;
  }
  /**
   * Converts the start and end to JS dates. The required arguments are
   * those of the Date constructor
   * @param {integer} y 
   * @param {integer} m 
   * @param {integer} d
   * @return object An object with a 'start' and 'end' key, containing the dates 
   */
  toDates(y,m,d){
    return {
      start: this.start.toDate(y, m, d),
      end: this.end.toDate(y, m, d)
    };
  }
  /**
   * Checks whether this interval intersects another. Full overlap is also considered
   * intersecting
   * @param {IntegerTimeInterval} interVal 
   */
  intersects(interval, ignoreEndPoints = false){
    return this.contains(interval.start, ignoreEndPoints) || this.contains(interval.end, ignoreEndPoints) || this.isSubsetOf(interval);
  }
  /**
   * Returns whether this interval is a subset of the other interval, i.e. is 
   * fully included in the other.
   * @param {IntegerTimeInterval} interval 
   */
  isSubsetOf(interval){
    return interval.contains(this.start) && interval.contains(this.end);
  }
}

export function formatDuration(durationSeconds){
  let min = Math.floor(durationSeconds/60);
  let secs = durationSeconds - min*60;
  return min + ':' + secs;
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
  const hours = Math.floor(intTime/100);
  const minutes = intTime - hours * 100;
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