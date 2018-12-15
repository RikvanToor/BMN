import React, { Component, PureComponent } from "react";

//UI components
import DatePicker from '@Components/DatePicker.jsx';
import ConditionalComponent from '@Components/ConditionalComponent.jsx';
import {FormGroup,ControlLabel, Label, Panel, OverlayTrigger, Tooltip, FormControl, Row, Col, Alert, Button,Glyphicon, ButtonGroup} from 'react-bootstrap';
import GlyphButton from '@Components/GlyphButton.jsx';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {pullBottomStyle} from '@Components/UiHelpers.js';
import * as typeChecks from '@Utils/TypeChecks.js';
import ColorRanges from '@Components/ColorRanges.jsx';
import {IntegerTime, IntegerTimeInterval} from '@Utils/DateTimeUtils.js';

//Property checking
import PropTypes from 'prop-types';

//Data imports
import {Record, Map, fromJS, List, Set as ImmutableSet} from 'immutable';
import {intRange} from '@Utils/Ranges.js';
import RehearsalSong from '@Models/RehearsalSong.js';


class SongSlider extends PureComponent{
  constructor(props){
    super(props);
    this.onChange = this.onChange.bind(this);
    this.labelFunc = this.labelFunc.bind(this);
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
   * Convert to local values that takes into account steps and
   * minimum
   * @param {integer} time 
   * @param {integer} step 
   */
  toLocalValue(time, step=5){
    const diff = minutesDiff(this.props.timeRange.start,hourMinutes);
    return diff / minuteSteps;
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
  render(){
      let {songTitle, value, timeRange, ...rest} = this.props;
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

      return (
          <Row {...rest} style={{paddingBottom:'5px',paddingTop:'5px'}}>
          <Col xs={3} md={3} style={pullBottomStyle}>
                  <h4>{songTitle}</h4>
          </Col>
          <Col xs={7} md={7} style={pullBottomStyle}>
                <InputRange 
                  minValue={0} maxValue={range} onChange={this.onChange}
                  value={valObj} formatLabel={this.labelFunc}/>
                {availabilityIndicator}  
          </Col>
          </Row>
      );
    }
}
SongSlider.propTypes = {
  songTitle: PropTypes.string.isRequired,
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
  timeRange: PropTypes.instanceOf(IntegerTimeInterval).isRequired
};

export default class RehearsalSongsForm extends Component{
    constructor(props){
      super(props);

      //Get appropriate format for supplied schedule
      let rehearsalSongs = this.props.schedule;
      if(typeChecks.isUndefined(rehearsalSongs)){
        rehearsalSongs = new Map();
      }
      else{
        //Setup the map with values. Don't use the direct Map() constructor with an object here, since then the 
        //keys will be converted to strings, which causes problems later on.
        rehearsalSongs = (new Map()).withMutations(map=>{
          rehearsalSongs.forEach((el)=>{
            let timeInterval = IntegerTimeInterval.fromDateString(el.pivot.start, el.pivot.end);
            map.set(el.id, new RehearsalSong({id: el.id, title: el.title, rehearsalTime: timeInterval}));
          });
        });
      }
      
      this.state = {
        selectedSong: [],
        rehearsalSongs: rehearsalSongs,
        songIds: new ImmutableSet(rehearsalSongs.valueSeq().map((el)=>el.id)),
        songErrs:{}
      };
      
      //Bound callbacks
      this.updateSelectedSong = this.updateSelectedSong.bind(this);
      this.addRehearsalSong = this.addRehearsalSong.bind(this);
      this.updateSongRange = this.updateSongRange.bind(this);
      this.onSave = this.onSave.bind(this);
    }
    /**
     * Updates the song time range value.
     */
    updateSongRange(value, props){
      this.setState({
        rehearsalSongs: this.state.rehearsalSongs.setIn([props.songid,'rehearsalTime'],value)
      });
    }
    /**
     * Sets the currently selected song in the dynamic textbox
     * @param {array} value The selected song (as first element of an array).
     */
    updateSelectedSong(value){
      if(value.length == 0)
        this.setState({selectedSong: []});
      else
        this.setState({
          selectedSong: [value[0]]
        });
    }
    /**
     * Adds a new form for the currently selected song to determine rehearsal time.
     */
    addRehearsalSong(){
      if(this.state.selectedSong.length === 0) return;
      
      //Prepare song to be used with slider.
      let song = this.state.selectedSong[0];
      let rehearsalSong = new RehearsalSong(song); //Record type object
      rehearsalSong = rehearsalSong.setRehearsalTime(this.props.startTime, this.props.endTime);
      console.log(rehearsalSong);
      let newState = {
        selectedSong: [],
        songIds: this.state.songIds.add(rehearsalSong.id),
        rehearsalSongs: this.state.rehearsalSongs.set(rehearsalSong.id, rehearsalSong)
      };

      this.setState(newState);
    }
    /**
     * Renders the form for a song
     * @param {object} song The song to render.
     */
    renderSongForm(song, timeRange){
      console.log("SONG");
      console.log(song);
      return (
        <React.Fragment key={song.title} >
          <SongSlider key={song.title} songTitle={song.title} timeRange={timeRange}
            onChange={this.updateSongRange} songid={song.id} value={song.rehearsalTime} step={5}/>
            {this.state.songErrs[song.id]? (<Alert key={song.title} bsStyle="danger">{this.state.songErrs[song.id]}</Alert>) : null}
        </React.Fragment>
      );
    }
    
    /**
     * Handle the save action. Check for any overlaps in rehearsal times and report.
     * If no overlaps are present, execute the onSave() prop with the songs.
     */
    onSave(){
      //Brute force look for overlap
      let conflictPairs = {};
      let overlaps = false;
      let songs = this.state.rehearsalSongs.valueSeq();
      for(let i = 0; i < songs.size; i++){
        for(let j = i+1; j < songs.size; j++){
          //Check for intersection
          if(songs.getIn([i,'rehearsalTime']).intersects(songs.getIn([j,'rehearsalTime']))){
            overlaps = true;

            let i1 = songs.get(i).id;
            let i2 = songs.get(j).id;
            if(!(i1 in conflictPairs)) conflictPairs[i1] = [];
            if(!(i2 in conflictPairs)) conflictPairs[i2] = [];
            //Record conflicts
            conflictPairs[i1].push(this.state.rehearsalSongs.getIn([i2,'title']));
            conflictPairs[i2].push(this.state.rehearsalSongs.getIn([i1,'title']))
          }
        }
      }
      //No conflicts
      if(!overlaps){
        this.props.onSave(songs);
      }
      //Report conflicts
      else{
        let errs = Object.keys(conflictPairs).reduce((accum,ind)=>{
          accum[ind] = 'De geselecteerde tijd overlapt met ' + conflictPairs[ind].join(',');
          return accum;
        },{});
        this.setState({songErrs:errs});
      }
    }
    render(){
      let songs = Array.isArray(this.props.songs) ? new List(this.props.songs) : this.props.songs;

      //Remaining songs to select
      let songsLeft = songs.filter((val)=>{
        return !this.state.songIds.contains(val.id);
      });
      console.log("SONGS MAP");
      console.log(this.state.rehearsalSongs);

      //Start and end time
      let start = this.props.startTime instanceof IntegerTime ? this.props.startTime: IntegerTime.fromArmyTime(this.props.startTime);
      let end = this.props.endTime instanceof IntegerTime ? this.props.endTime: IntegerTime.fromArmyTime(this.props.endTime);
      let timeRange = new IntegerTimeInterval(start, end);
      return (
        <React.Fragment>
          <Row>
          <Col xs={2}>
          <h3>Rooster</h3>
          </Col>
          <Col xs={3} style={pullBottomStyle}>
            <Label>Zoek een nummer</Label>
            <Typeahead options={songsLeft.toJS()} selected={this.state.selectedSong} onChange={this.updateSelectedSong} labelKey="title"></Typeahead>
          </Col>
          <Col xs={3} style={pullBottomStyle}>
              <GlyphButton glyph="plus" color="green" onClick={this.addRehearsalSong}>Voeg toe</GlyphButton>
          </Col>
          </Row>
          <ConditionalComponent condition={this.state.rehearsalSongs.size > 0}>
            <Panel style={{marginTop:'10px',padding:'5px'}}>
              {this.state.rehearsalSongs.valueSeq().map((song)=>this.renderSongForm(song, timeRange))}
              <Row>
                <Col xs={5} md={5}>
                  <Button bsStyle='success' onClick={this.onSave}>Opslaan</Button>
                  <Button bsStyle='danger' onClick={this.props.onCancel}>Annuleren</Button>
                </Col>
              </Row>
            </Panel>
          </ConditionalComponent>
        </React.Fragment>
      );
    }
}
RehearsalSongsForm.propTypes = {
  //Available songs
  songs : PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]).isRequired,
  //Songs for the rehearsal
  schedule : PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(List)]).isRequired,
  startTime: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(IntegerTime)]).isRequired,
  endTime: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(IntegerTime)]).isRequired,
  availabilities: PropTypes.object,
  //Interaction
  onCancel: PropTypes.func.isRequired,
  //Receives the Map of RehearsalSong elements
  onSave: PropTypes.func.isRequired
};