import React, { PureComponent } from "react";
import PropTypes from 'prop-types';
import {FormControl, Form, FormGroup, HelpBlock} from 'react-bootstrap';
import {isUndefined} from '@Utils/TypeChecks.js';

export default class TimeSelector extends PureComponent {
  constructor(props){
    super(props);
    
    //Bound callbacks
    this.triggerHourChange = this.triggerHourChange.bind(this);
    this.triggerMinuteChange = this.triggerMinuteChange.bind(this);
  }
  triggerHourChange(e){
    if(this.props.onHourChange){
      this.props.onHourChange(e.target.value, this.props);
    }
  }
  triggerMinuteChange(e){
    if(this.props.onMinuteChange){
      this.props.onMinuteChange(e.target.value, this.props);
    }
  }
  render(){
    const hasErr = !isUndefined(this.props.err) && this.props.err.length !== 0;
    const groupClass = hasErr ? 'form-inline has-error' : 'form-inline';
    return (
      <div className={groupClass}>
        <FormControl componentClass="select" onChange={this.triggerHourChange}>
          {this.props.hourOptions.map((value)=>
            <option value={value} key={value}>{value}</option>
          )}
        </FormControl>
        {this.props.spaceComponent ? this.props.spaceComponent : (<span style={{marginLeft:'10px',marginRight:'10px'}}>:</span>)}
        <FormControl componentClass="select" onChange={this.triggerMinuteChange}>
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
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]),
  spaceComponent: PropTypes.element,
  err : PropTypes.string
};
