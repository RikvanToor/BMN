import React, { PureComponent } from "react";
import PropTypes from 'prop-types';
import {FormControl, Form, FormGroup, HelpBlock} from 'react-bootstrap';
import {isUndefined, isNumber} from '@Utils/TypeChecks.js';
import IntegerTime from '@Utils/IntegerTime.js';

export const TimeParts = {
  HOURS: 'hours',
  MINUTES: 'minutes'
};

export default class TimeSelector extends PureComponent {
  constructor(props){
    super(props);
    
    //Bound callbacks
    this.triggerHourChange = this.triggerHourChange.bind(this);
    this.triggerMinuteChange = this.triggerMinuteChange.bind(this);
  }
  triggerHourChange(e){
    if(this.props.onHourChange){
      this.props.onHourChange(parseInt(e.target.value), this.props);
    }
    if(this.props.onAnyChange){
      this.props.onAnyChange(parseInt(e.target.value),'hours', this.props);
    }
  }
  triggerMinuteChange(e){
    if(this.props.onMinuteChange){
      this.props.onMinuteChange(parseInt(e.target.value), this.props);
    }
    if(this.props.onAnyChange){
      this.props.onAnyChange(parseInt(e.target.value),'minutes', this.props);
    }
  }
  render(){
    const hasErr = !isUndefined(this.props.err) && this.props.err.length !== 0;
    const groupClass = hasErr ? 'form-inline has-error' : 'form-inline';
    
    let value = this.props.value; //Ok if number
    if(value instanceof Date){
      value = this.props.value.getHours() * 100 + this.props.value.getMinutes()
    }
    else if(value instanceof IntegerTime){
      value = value.toArmyTime();
    }

    const hours = Math.floor(value/100);
    const minutes = value - hours * 100;
    return (
      <div className={groupClass}>
        <FormControl componentClass="select" onChange={this.triggerHourChange} value={hours}>
          {this.props.hourOptions.map((value)=>
            <option value={value} key={value}>{value}</option>
          )}
        </FormControl>
        {this.props.spaceComponent ? this.props.spaceComponent : (<span style={{marginLeft:'10px',marginRight:'10px'}}>:</span>)}
        <FormControl componentClass="select" onChange={this.triggerMinuteChange} value={minutes}>
          {this.props.minuteOptions.map((value)=>
            <option value={value} key={value}>{value}</option>
          )}
        </FormControl>
      </div>
      
    );
  }
}
TimeSelector.propTypes = {
  hourOptions: PropTypes.array.isRequired,
  minuteOptions: PropTypes.array.isRequired,
  onHourChange: PropTypes.func,
  onMinuteChange: PropTypes.func,
  //Triggered if either hours or minutes are changed. Receives (value, <'hours'||'minutes'>, props), where value is the
  //integer representation of the changed value. 
  onAnyChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date), PropTypes.instanceOf(IntegerTime)]).isRequired,
  spaceComponent: PropTypes.element,
  err : PropTypes.string
};
