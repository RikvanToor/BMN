import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FormControl} from 'react-bootstrap';
import {delimSubstring} from '@Utils/StringUtils.js';

function isCharNumber(c){
    let diff = c - '0';
    return diff >= 0 && diff <= '9';
}

function parseInputFormat(formatStr){
    let type = formatStr[0] == 'l' ? 'letter' : 'number';
    let mod = formatStr[1] == '*' ? -1 : parseInt(formatStr.substr(1));
    return {type:type,mod:mod};
}
class ValueHolder{
    constructor(defaultValue,modifiable=true, checkFn=false){
        this.value = defaultValue + '';
        this.length = defaultValue.length;
        this.checkFn = checkFn;
        this.modifiable = true;
        this.leftPad = '';
        this.maxSize = -1;
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
        return !this.checkFn || this.checkFn.test(value); 
    }
    length(){
        return this.length;
    }
    in(location){
        return location >= 0 && location < this.length;
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
        if(!this.valid(value)) return false;
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
        if(location == this.length -1){
            value = this.value.slice(1) + c; 
        }
        else if(location >= this.length){
            value = c;
        }
        else{
            value = this.value;
            value[location] = c;
        }
        return this.trySetValue(value);
    }
    atEnd(location){
        return this.length == location;
    }
}

export default class FormattedTextField extends Component{
    constructor(props){
        super(props);

        //Parse the format
        let parts =this.props.format.map(el=>{
            if('fixed' in el) return new ValueHolder(el.fixed,false);
            return new ValueHolder(el.default);
        }); 
        this.modifiableInds = parts.reduce((accum,el,i)=>{
            if(!el.modifiable) return accum;
            accum.push(i);
            return accum;
        },[]);

        this.state = {
            parts: parts,
            partLengths: parts.map(el=>el.length),
            value: parts.reduce((accum,el)=>accum + el.value,''),
            currentPart: 0 
        };
        console.log("BINDING");
        //Bound callbacks
        this.onChange = this.onChange.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }
    onFocus(e){
        console.log("FOCUS");
        this.dom.selectionStart = 0;
        this.dom.selectionEnd = 0;
        this.setState({currentPart:0});
    }
    onKeyUp(e){
        console.log(e);
        let location = e.target.selectionStart;
        //Handle tab
        if(e.which == 9){
            //Backwards
            if(e.shiftKey){
                //Don't handle when at start
                if(location <= 0) return;

            }
            //Forward
            else{

            }
        }
        //Backspace
        else if(e.which == 8){

        }
        //Left arrow
        else if(e.which == 37){

        }
        //Right arrow
        else if(e.which == 39){

        }
        //Rest
        else if(!e.altKey && !e.ctrlKey){
            
        }
    }
    onChange(e){
    }
    findPart(location){
        let min = 0;
        for(let i = 0; i < this.state.parts.length; i++){
            if(location >= min && location < min + this.state.partLengths[i]) return i;
            min += this.state.partLengths[i];
        }
        return -1;
    }
    getPartStart(part){
        let start = 0;
        for(let i = 0; i < part; i++){
            start += this.state.partLengths[i];
        }
        return start;
    }
    //Set caret to start of part on double click
    onDoubleClick(e){
        let domNode = e.relatedTarget;
        let selectedLoc  = domNode.selectionStart;
        let part = this.findPart(selectedLoc);
        domNode.selectionStart = this.getPartStart(part);
    }

    render(){
        return (
            <FormControl inputRef={(ref)=>{this.dom = ref;}} onChange={this.onChange} onKeyUp={this.onKeyUp} value={this.state.value} onFocus={this.onFocus} />
        );
    }
}

export const timeFormat = [
    {type:'number',leftPad:'0',size:[1,2], default:'0'},
    {fixed: ':'},
    {type:'number',leftPad:'0',size:2,default:'00'}
];

FormattedTextField.propTypes = {
    format : PropTypes.array.isRequired
}; 