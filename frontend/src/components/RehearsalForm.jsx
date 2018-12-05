import React, { Component } from "react";
import DatePicker from '@Components/DatePicker.jsx';
import ConditionalComponent from '@Components/ConditionalComponent.jsx';
import PropTypes from 'prop-types';
import {Record, Map, fromJS} from 'immutable';
import {FormGroup,ControlLabel, Label, Panel, FormControl, Row, Col, Button,Glyphicon, ButtonGroup} from 'react-bootstrap';
import TimeSelector from '@Components/TimeSelector.jsx';

import {intRange} from '@Utils/Ranges.js';
import {changeMinutes, changeHour, isDateLess} from '@Utils/DateTimeUtils.js';

class Rehearsal extends Record({date:new Date(), startTime:1800, endTime:2100, location:"dB's"}){}

//Possible hours and minutes to select for rehearsal
const availableHours = intRange(0,24);
const availableMinutes = intRange(0,60,5);

export default class RehearsalForm extends Component{
    constructor(props){
      super(props);
      //Newly created rehearsals
      this.state = {
        rehearsals : new Map({'0': new Rehearsal()}),
        errs : new Map(),
        maxId: 0
      };
      
      //Bound callbacks
      this.addNewRehearsalForm = this.addNewRehearsalForm.bind(this);
      this.handleDateSelect = this.handleDateSelect.bind(this);
      this.handleLocationChange = this.handleLocationChange.bind(this);
      this.deleteRehearsal = this.deleteRehearsal.bind(this);
      this.changeHour = this.changeHour.bind(this);
      this.changeMinutes = this.changeMinutes.bind(this);
      this.save = this.save.bind(this);
      this.cancel = this.cancel.bind(this);
    }
    
    /**
     * Adds a new rehearsal form row to the form
     */
    addNewRehearsalForm(){
      //Update the state
      let newState = {
        rehearsals: this.state.rehearsals.set((this.state.maxId+1).toString(), new Rehearsal()),
        maxId : this.state.maxId + 1
      };
      this.setState(newState);
    }
    /**
     * Delete a rehearsals row from the form
     */
    deleteRehearsal(e){
      let domNode = e.currentTarget; //Refers to the button here. e.target may be a child element
      
      //Select ID via data-* attributes on the DOM node
      if('rehearsalid' in domNode.dataset){
        //Set new state by deleting element in immutable map
        this.setState({
          rehearsals: this.state.rehearsals.delete(domNode.dataset.rehearsalid)
        });
      }
    }
    /**
     * Cancels the form. Calls the onCancel property callback and clears out all state.
     * @param {event} e The click event
     */
    cancel(e){
      this.setState({
        rehearsals : new Map({'0': new Rehearsal()}),
        errs : new Map(),
        maxId: 0
      });
      this.prop.onCancel();
    }
    /**
     * Tries to save the rehearsals. 
     * @param {event} e The click event
     */
    save(e){
      //Gather validation errors
      let totalErrs = this.state.rehearsals.reduce((accum,v,k)=>{
        let errs = this.validateRehearsal(v);
        if(Object.keys(errs).length !== 0){
          accum[k] = errs;
        }
        return accum;
      },{});
      
      //No validation errors are present
      if(Object.keys(totalErrs).length === 0){
        this.props.onSave(this.state.rehearsals.valueSeq().toJS());
      }
      //Set the validation errors and visualize.
      else{
        console.log('Has errs');
        console.log(totalErrs);
        let inputErrs = fromJS(totalErrs);
        this.setState({
          errs: inputErrs
        });
        return;
      }
    }
    /**
     * Handles the selection of a new date via the DatePicker component
     * @param {string} newValue The new date, represented as an ISO string
     * @param {string} newValueDsiplay The new date, formatted in a readable string format
     * @param {object} props The properties of the DatePicker that triggered the change
     */
    handleDateSelect(newValue, newValueDisplay, props){
      this.setState({
        rehearsals: this.state.rehearsals.setIn([props.rehearsalId,'date'], new Date(newValue))
      });
    }
    handleLocationChange(e){
      let domNode = e.target;
      if('rehearsalid' in domNode.dataset){
        const id = domNode.dataset.rehearsalid;
        this.setState({
          rehearsals: this.state.rehearsals.setIn([id, 'location'],domNode.value)
        });
      }
    }
    changeValue(val, props, isHour){
      let newState = {};
      const id = props.rehearsalId;
      const target = props.type === "end" ? 'endTime' : 'startTime';
      const orig = this.state.rehearsals.getIn([id,target]);
      const newVal = isHour ? changeHour(orig, val): changeMinutes(orig,val);
      newState.rehearsals = this.state.rehearsals.setIn([props.rehearsalId,target],newVal);
      this.setState(newState);
    }
    changeHour(hour, props){
      this.changeValue(hour,props,true);
    }
    changeMinutes(minutes, props){
      this.changeValue(minutes,props,false);
    }
    /**
     * Renders the rehearsal. If this is the only rehearsal, do not add the 'Delete' button.
     * @param {int} id The ID of the rehearsal
     * @param {boolean} isOnly Whether the rehearsal is the only rehearsal present
     */
    renderRehearsal(id, isOnly){
      const rehearsal = this.state.rehearsals.get(id);
      const pullBottom = {display:'inline-block',verticalAlign:'bottom',float:'none'};
      const errs = this.state.errs.has(id) ? this.state.errs.get(id) : {};
      
      const timeSelectorOpts = {
        hourOptions : availableHours,
        minuteOptions : availableMinutes,
        onHourChange: this.changeHour,
        onMinuteChange: this.changeMinutes,
        rehearsalId: id
      };
      
      return (<Row key={id}>
        <Col xs={2} md={2} style={pullBottom}>
          <Label>Datum</Label>
          <DatePicker rehearsalId={id} value={rehearsal.date.toISOString()} onChange={this.handleDateSelect}/>
        </Col>
        <Col xs={3} md={3} style={pullBottom}>
          <Label>Locatie</Label>
          <FormControl type="text" value={rehearsal.location} onChange={this.handleLocationChange} data-rehearsalid={id}></FormControl>
        </Col>
        <Col xs={3} md={3} style={pullBottom}>
          <Label>Begintijd</Label>
          <TimeSelector type="start" value={rehearsal.startTime} {...timeSelectorOpts}/>
        </Col>
        <Col xs={3} md={3} style={pullBottom}>
          <Label>Eindtijd</Label>
          <TimeSelector type="end" value={rehearsal.endTime} {...timeSelectorOpts}/>
        </Col>
        <Col xs={1} md={1} style={pullBottom}>
          <ButtonGroup>
          <Button onClick={this.addNewRehearsalForm} data-rehearsalid={id} style={{marginRight:'5px'}}><Glyphicon glyph="duplicate" style={{color:'orange'}}/></Button>
            {!isOnly ? (<Button data-rehearsalid={id} onClick={this.deleteRehearsal}><Glyphicon glyph="minus" style={{color:'red'}}/></Button>) : null}
          </ButtonGroup>
        </Col>
      </Row>);
    }
    
    validateRehearsal(rehearsal){
      let errs = {};
      if(isDateLess(rehearsal.date, new Date())){
        errs.dateErr = 'De geselecteerde datum is in het verleden';
      }
      if(rehearsal.startTime > rehearsal.endTime){
        errs.startTimeErr = 'De starttijd is later dan de eindtijd';
      }
      if(rehearsal.location.length === 0){
        errs.locationerr = 'Er is geen locatie gegeven';
      }
      return errs;
    }
    render(){
      const rehearsalCount = this.state.rehearsals.size;
      return (
        <Panel style={{marginTop:'5px',marginBottom:'5px'}}>
          <Panel.Body>
            {this.state.rehearsals.keySeq().map((key)=>this.renderRehearsal(key, rehearsalCount === 1))}
            <div style={{marginTop:'5px'}}>
              <Button bsStyle="primary" style={{marginRight:'5px'}} onClick={this.save}>{rehearsalCount===1 ? 'Voeg repetitiedag toe' : 'Voeg repetitiedagen toe'}</Button>
              <Button bsStyle="danger" onClick={this.props.onCancel}>Toch niet!</Button>
            </div>
          </Panel.Body>
        </Panel>
      );
    }
}
RehearsalForm.propTypes = {
  onSave : PropTypes.func.isRequired,
  onCancel : PropTypes.func.isRequired
};