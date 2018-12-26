export default class Interval{
    constructor(min, max){
        this.min = min;
        this.max = max;
    }
    add(val){
        if(val < this.min) this.min = val;
        if(val > this.max) this.max = val;
    }
    contains(val){
        return val >= this.min && val <= this.max;
    }
    intersects(other){
        return this.contains(other.min) || this.contains(other.max) || other.contains(this.min);
    }
    /**
     * Returns a 'union' of the intervals by taking the minimum of the minima and the maximum
     * of the maxima for the new interval.
     * @param {Interval} other 
     * @return Interval The new interval
     */
    union(other){
        return new Interval(Math.min(this.min, other.min), Math.max(this.max, other.max));
    }
    /**
     * Creates an empty interval
     */
    static empty(){
        return new Interval(Infinity, -Infinity);
    }
}