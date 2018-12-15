//UI imports
import React, {PureComponent} from 'react';
import ColorRanges from '@Components/ColorRanges.jsx';
import {Row, Col, Label, Form} from 'react-bootstrap';
import {pullBottomStyle} from '@Components/UiHelpers.js';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import TimeSelector, {TimeParts} from '@Components/TimeSelector.jsx';

//Utils
import PropTypes from 'prop-types';
import * as typeChecks from '@Utils/TypeChecks.js';
import {intRange} from '@Utils/Ranges.js';
import {IntegerTime, IntegerTimeInterval} from '@Utils/DateTimeUtils.js';

export const SongEditStyles = { 
    SLIDER: 0,
    TEXTBOX: 1
};

export default class SongTimeSlider extends PureComponent{
    constructor(props){
      super(props);
      this.onChange = this.onChange.bind(this);
      this.labelFunc = this.labelFunc.bind(this);
      this.handleTimeChange = this.handleTimeChange.bind(this);
    }
    onChange(value){
      let startTime = this.props.timeRange.start;
      
      //Convert value to integer time again
      let min = IntegerTime.fromRelativeSteps(value.min, startTime, 5);
      let max =  IntegerTime.fromRelativeSteps(value.max, startTime, 5);
  
      //Return the interval
      let newValue = new IntegerTimeInterval(min,max);
      this.props.onChange(newValue, this.props);
    }

    /**
     * Handles time change on a TimeSelector component
     * @param {integer} value 
     * @param {string} valueType
     * @param {object} props 
     */
    handleTimeChange(value, valueType, props){
        let type = props.type; //'start' or 'end', as specified on the components
  
        //Get the original time
        let time = this.props.value.copy();
        const target = valueType == TimeParts.HOURS ? 'h' : 'm';
        //Update the time part
        time[type][target] = value;
  
        //Clamp
        this.props.timeRange.clamp(time[type]);

        let span = time.span();
        //The interval got flipped: exchange start and end
        if(span < 0){
          let temp = time.start;
          time.start = time.end;
          time.end = temp;
        }
        //The interval is empty: expand the end by 5.
        else if(span == 0){
          //The interval is at the end of the range: expand the start.
          if(time.end.equals(this.props.timeRang.end)){
            time.start.m -= 5;
          }
          //Expand the end
          else
            time.end.m += 5;
        }

        //Trigger the change handler
        this.props.onChange(time, this.props);
      }

    /**
     * Function for labeling the selected bounds 
     * @param {integer} value 
     */
    labelFunc(value){
      const val = IntegerTime.fromRelativeSteps(value, this.props.timeRange.start, 5);
      let hourStr = val.h < 10 ? '0' + val.h : val.h;
      let minuteStr = val.m < 10 ? '0' + val.m : val.m;
      return hourStr + ':' + minuteStr;
    }
    getUnavailableColor(numberOfUnavailable){
      //Maybe do something more sophisticated here.
      switch(numberOfUnavailable){
        case 0: return 'green';
        case 1: return 'orange';
        default:
          return 'red';
      }
    }
    renderInput(range, valObj, availabilityIndicator){
        if(this.props.editStyle == SongEditStyles.SLIDER){
            return (
                <React.Fragment>
                    <InputRange 
                    minValue={0} maxValue={range} onChange={this.onChange}
                    value={valObj} formatLabel={this.labelFunc}/>
                    {availabilityIndicator}
                </React.Fragment>
            );
        }
        else{
            const timeSelectorOpts = {
                hourOptions : intRange(this.props.timeRange.start.h, this.props.timeRange.end.h+1),
                minuteOptions : intRange(0, 60, 5),
                onAnyChange: this.handleTimeChange,
              };
              //There should be an nicer solution than using Row-Col here
            return (
            <React.Fragment>
                <Row>
                <Col xs={6} md={6}>
                <Label>Begintijd</Label>
                <TimeSelector type="start" value={this.props.value.start} {...timeSelectorOpts}/>
                </Col>
                <Col xs={6} md={6}>
                <Label>Eindtijd</Label>
                <TimeSelector type="end" value={this.props.value.end} {...timeSelectorOpts}/>
                </Col>
                </Row>
            </React.Fragment>
            );
        }
    }
    
    render(){
        let {value, timeRange,editStyle, onChange, ...rest} = this.props;
        let range = timeRange.span() / 5;
  
        let startTime = this.props.timeRange.start;
        
        //Convert the IntegerTime values to local steps to be used in the InputRange
        let valObj = {};
        valObj.min = value.start.toRelativeSteps(startTime, 5);
        valObj.max = value.end.toRelativeSteps(startTime, 5);
  
  
        //Render an availability indicator when data is available.
        let availabilityIndicator = null;
        if(this.props.availabilityIntervals){
          //Intervals
          let ints = this.props.availabilityIntervals.map((el)=>{
            return {
              start: el.start.toRelativeSteps(startTime,5),
              end: el.end.toRelativeSteps(startTime,5),
              color: this.getUnavailableColor(el.notAvailableNum),
              toolTip: el.notAvailableNum == 0 ? '' : 'Afwezig: ' + el.unavailableUsers.join(', ')
            };
          });
          availabilityIndicator = (
            <React.Fragment>
              <div>Aanwezigheid indicator</div>
              <ColorRanges start={0} end={range} ranges={ints}/>
            </React.Fragment>
          );
        }
  
        return this.renderInput(range, valObj, availabilityIndicator);
      }
  }
  SongTimeSlider.propTypes = {
    //Shape of objects: start, end, notAvailableNum, unavailableUsers
    availabilityIntervals: (props, propName)=>{
      if(typeChecks.isUndefined(props[propName])) return;
      
      if(!Array.isArray(props[propName]) && !(props[propName] instanceof List)){
        return new Error('Expected availabilityIntervals to be of an iterable type');
      }
      //Do check on keys
    },
    value : PropTypes.object.isRequired,
    onChange : PropTypes.func.isRequired,
    timeRange: PropTypes.instanceOf(IntegerTimeInterval).isRequired,
    editStyle: PropTypes.oneOf([SongEditStyles.SLIDER, SongEditStyles.TEXTBOX]).isRequired
  };