import React, { Component } from "react";
import DatePicker from '@Components/DatePicker.jsx';
import {FormGroup,ControlLabel} from 'react-bootstrap';

export default class RehearsalForm extends Component{
    constructor(props){
      super(props);
      this.state = {
        date : new Date()
      };
    }
    render(){
      return (
              <FormGroup>
              <ControlLabel>Datum</ControlLabel>
              <DatePicker value={this.state.date.toISOString()} onChange={this.handleDateSelect}/>
              </FormGroup>
      );
    }
}