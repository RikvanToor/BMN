
export default class HSLGradient{
    //https://www.w3schools.com/colors/colors_hsl.asp
    /**
     * Creates an HSL gradient provider that generates an 'hsl' CSS string.
     * @param {integer} minHue Minimum hue
     * @param {integer} maxHue Maxmimum hue
     * @param {integer} sat Saturation to use
     * @param {integer} lum Luminance to use
     */
    constructor(minHue,maxHue,sat,lum){
      this.minHue = minHue;
      this.hueDiff = maxHue - minHue;
      this.sat = sat;
      this.lum = lum;
      
      //Min max values
      this.min = 0;
      this.max = 1;
    }
    /**
     * Associate a minimum and maximum value with the gradient
     * @param {number} min Minimum value
     * @param {number} max Maximum value
     */
    setMinMax(min,max){
      this.min = min;
      this.max = max;
    }
    /**
     * Internal use. Get a string representing the color
     * @param {number} val Lookup value
     */
    localGetColour(val){
      return 'hsl('+(this.minHue + val * this.hueDiff)+','+this.sat+'%,'+this.lum+'%)';
    }
    /**
     * Returns a color for the given value. Set the minimum and maximum first with setMinMax()
     * Then, the returned color is has the saturation and luminance as set before and the
     * hue which is the linear interpolation of the min/maxHue, according to the relative position
     * of the value within the minimum/maximum interval
     * @param {number} val The value to acquire a color for.
     */
    get(val){
      if(this.min === this.max) return this.localGetColour(0);
      
      let frac = (val - this.min)/(this.max-this.min);
      return this.localGetColour(frac);
    }
  }