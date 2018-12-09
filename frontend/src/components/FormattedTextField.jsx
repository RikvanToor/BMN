import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FormControl} from 'react-bootstrap';
import {delimSubstring, replace as strReplace} from '@Utils/StringUtils.js';
import Format from '@Components/FormatParts/Format.js';
import ValueHolder from '@Components/FormatParts/ValueHolder.js';

const KeyCodes = {
    LEFT_ARROW:37,
    RIGHT_ARROW:39,
    TAB:9,
    BACKSPACE:8
};

export default class FormattedTextField extends Component{
    constructor(props){
        super(props);

        //Parse the format
        let parts =this.props.format; 

        this.state = {
            format: new Format(parts),
            justReceivedFocus: false
        };
        //Bound callbacks
        this.onChange = this.onChange.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }
    onFocus(e){
        this.triggerCaretTo(0,{justReceivedFocus:true});
    }
    triggerCaretTo(loc,state = false){
        if(!state){
            this.setState({format:this.state.format},()=>{console.log('Caret to'+loc);this.setCaretTo(loc);});
        }
        else{
            this.setState(state,()=>{console.log('Caret to'+loc);this.setCaretTo(loc);});
        }
    }
    /**
     * Set the caret position of the DOM element to the specified location
     * @param {integer} loc The location
     */
    setCaretTo(loc){
        this.dom.selectionStart = this.dom.selectionEnd = loc;
    }
    onKeyDown(e){
        let location = e.target.selectionStart;
        if(e.keyCode == KeyCodes.TAB){
            let part = this.state.format.findPart(location);
            let newPartForward = this.state.format.nextModifiablePart(part);
            let newPartBackward = this.state.format.prevModifiablePart(part);
            if(e.shiftKey && newPartBackward != -1 || !e.shiftKey && newPartForward != -1){
                e.preventDefault();
            }
        }
    }
    onKeyUp(e){
        let location = e.target.selectionStart;
        let format = this.state.format;

        //Handle tab
        if(e.which == KeyCodes.TAB){
            let newActivePart = 0;
            let part = format.findPart(location);
            //Backwards or forwards
            newActivePart = e.shiftKey ? format.prevModifiablePart(part) : format.nextModifiablePart(part);

            if(newActivePart == -1) return;
            if(this.state.justReceivedFocus){
                this.triggerCaretTo(0,{justReceivedFocus:false});   
                e.preventDefault(); 
                return;    
            }
            //Set the caret on the dom element
            this.triggerCaretTo(this.state.format.partStart(newActivePart));     
            e.preventDefault(); 
        }
        //Left arrow
        else if(e.which == KeyCodes.LEFT_ARROW){
            let newPos = location - 1;
            let part = format.findPart(location);
            if(location >= 0){
                if(format.partStart(part) > newPos){
                    let newPart = format.prevModifiablePart(part);
                    if(newPart != -1){
                        this.triggerCaretTo(format.partStart(newPart));
                    }
                }
            }
            e.preventDefault();
        }
        //Right arrow
        else if(e.which == KeyCodes.RIGHT_ARROW){
            let part = format.findPart(location);
            if(!format.part(part).contains(newPos)){
                let newPart = format.nextModifiablePart(part);
                if(newPart != -1){
                    this.triggerCaretTo(format.partStart(newPart));
                }
            }
            e.preventDefault();
        }
    }
    onChange(e){
        let dom = e.target;
        let diff = e.target.value.length - this.state.format.value().length;
        let success = false;
        let newLoc = dom.selectionStart;
        
        let part = '';
        let relLoc = '';
        //Add
        if(diff > 0){
            let loc = dom.selectionStart-1;
            part = this.state.format.findPart(loc);
            relLoc = this.state.format.relativeLocation(part,loc);
            success = this.state.format.part(part).add(e.target.value[loc], relLoc);
        }
        //Delete
        else if(diff < 0){
            let loc = dom.selectionStart;
            part = this.state.format.findPart(loc);
            relLoc = this.state.format.relativeLocation(part,loc);
            success = this.state.format.part(part).delete(e.target.value[loc]);
        }
        if(success){
            let nextMod = this.state.format.nextModifiablePart(part);
            if(this.state.format.part(part).atEnd(relLoc+1) && nextMod != -1){
                newLoc = this.state.format.partStart(nextMod);
            }
            this.setState({format: this.state.format},()=>{this.setCaretTo(newLoc);});

            //Handle any value conversion if a converter was specified
            let value = this.state.format.value();
            if(this.props.valueConverter){
                let values = this.state.format.parts.reduce((accum, el)=>{
                    if(el.modifiable) accum.push(el.value);
                    return accum;
                },[]);
                value = this.props.valueConverter(values);
            }
            //Trigger the onValueChange callback if specified 
            if(this.props.onValueChange){
                this.props.onValueChange(value, this);
            }
        }
    }
    //Set caret to start of part on double click
    onDoubleClick(e){
        let domNode = e.relatedTarget;
        let selectedLoc  = domNode.selectionStart;
        let part = this.state.format.findPart(selectedLoc);
        this.triggerCaretTo(this.state.format.partStart(part));
    }

    render(){
        //Hard code a FormControl element for now
        return (
            <FormControl onKeyDown={this.onKeyDown} 
                inputRef={(ref)=>{this.dom = ref;}} 
                onChange={this.onChange} 
                onKeyUp={this.onKeyUp} 
                value={this.state.format.value()} 
                onFocus={this.onFocus} />
        );
    }
}

export const timeFormat = [
    ValueHolder.number('00',2,'0'),
    ValueHolder.fixed(':'),
    ValueHolder.number('00',2,'0')
];

FormattedTextField.propTypes = {
    format : PropTypes.array.isRequired,
    valueConverter: PropTypes.func,
    onValueChange: PropTypes.func
}; 