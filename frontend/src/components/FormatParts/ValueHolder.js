import {replace as strReplace} from '@Utils/StringUtils.js';

export default class ValueHolder{
    constructor(defaultValue,modifiable=true, checkFn=false){
        this.value = defaultValue + '';
        this.length = defaultValue.length;
        this.checkFn = checkFn;
        this.modifiable = modifiable;
        this.leftPad = '';
        this.maxSize = -1;
    }
    /**
     * Returns a fixed value ValueHolder object.
     * @param {string} value The value to set
     * @returns A new ValueHolder object with a fixed value
     */
    static fixed(value){
        return new ValueHolder(value, false);
    }
    static number(defaultValue, size=-1, pad=''){
        let vh = new ValueHolder(defaultValue, true, (val)=>/^\d+$/.test(val));
        vh.maxSize = size;
        vh.leftPad = pad;
        return vh;
    }
    setModifiable(yesNo){
        this.modifiable = yesNo;
        return this;
    }
    setCheck(fn){
        this.checkFn = fn;
        return this;
    }
    setLeftPad(val, maxSize){
        this.leftPad = val;
        this.maxSize = maxSize;
        return this;
    }
    deleteAt(value, ind){
        if(ind == 0) return value.slice(1);
        if(ind == value.length-1) return value.slice(0,value.length-1);
        return value.slice(0,ind) + value.slice(ind+1);
    }
    valid(value){
        return !this.checkFn || this.checkFn(value); 
    }
    contains(location){
        return location >= 0 && (this.maxSize != -1 && location <= this.maxSize || location <= this.length);
    }
    /**
     * 
     * @param {integer} location ''Caret'' location within block
     * @param {boolean} backward Whether to delete forward or backward (i.e. backspace/delete) 
     */
    delete(location, backward=true){
        if(location == 0 && backward ||  location==this.length-1 && !backward) return;
        let value = this.value;
        if(backward){
            value = this.deleteAt(value,location-1);    
        }
        else{
            value = this.deleteAt(value,location);
        }

        return this.trySetValue(value);
    }
    trySetValue(value){
        if(!this.valid(value)) {
            return false;
        }
        if(this.maxSize > 0 && value.length < this.maxSize){
            value = this.leftPad.repeat(this.maxSize-value.length) + value;
        }
        this.value = value;
        this.length = value.length;
        return true;
    }
    add(c, location){
        //End: push character to right
        let value = '';
        if(location >= this.length){
            value = this.value.slice(1) + c; 
        }
        else{
            value = this.value;
            if(value.length > 1)
                value = strReplace(value, location,c);
            else
                value = c;
        }
        return this.trySetValue(value);
    }
    atEnd(location){
        return this.length == location;
    }
}