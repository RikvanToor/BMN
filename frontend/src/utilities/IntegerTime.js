
function clamp(val, min, max){
  if(val < min) return min;
  if(val > max) return max;
  return val;
}

/**
 * Class for simply representing time only.
 */
export default class IntegerTime{
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