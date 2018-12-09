/**
 * Class representing the format of a formatted text field
 */
export default class Format{
    constructor(parts){
        this.parts = parts;
    }
    part(ind){
        return this.parts[ind];
    }
    findPart(location){
        let queryLoc = location;
        for(let i = 0; i < this.parts.length -1; i++){
            if(this.parts[i].modifiable && this.parts[i].contains(queryLoc)){
                return i;
            }
            queryLoc -= this.parts[i].length;
        }
        return this.parts.length-1;
    }
    relativeLocation(part, location){
        return location - this.partStart(part);
    }
    nextModifiablePart(start){
        for(let i = start+1; i < this.parts.length; i++){
            if(this.parts[i].modifiable) return i;
        }
        return -1;
    }
    prevModifiablePart(start){
        for(let i = start-1; i >= 0; i--){
            if(this.parts[i].modifiable) return i;
        }
        return -1;
    }
    partStart(partNum){
        let total = 0;
        for(let i = 0; i < partNum; i++){
            total += this.parts[i].length;
        }
        return total;
    }
    value(){
        return this.parts.map((el)=>el.value).join('');
    }
}