import IntegerTime from '@Utils/IntegerTime.js';

/**
 * Represents an interval of integer times
 */
export default class IntegerTimeInterval{
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