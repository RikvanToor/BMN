import React, { Component, PureComponent } from "react";

//UI components
import DatePicker from '@Components/DatePicker.jsx';
import ConditionalComponent from '@Components/ConditionalComponent.jsx';
import {FormGroup,ControlLabel, Label, Panel, OverlayTrigger, Tooltip, FormControl, Row, Col, Alert, Button,Glyphicon, ButtonGroup} from 'react-bootstrap';
import GlyphButton from '@Components/GlyphButton.jsx';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {pullBottomStyle} from '@Components/UiHelpers.js';
import * as typeChecks from '@Utils/TypeChecks.js';
import ColorRanges from '@Components/ColorRanges.jsx';
import SongTimeSlider, {SongEditStyles as EditStyles} from '@Components/RehearsalComponents/SongTimeSlider.jsx';
import TimeSelector, {TimeParts} from '@Components/TimeSelector.jsx';

//Property checking
import PropTypes from 'prop-types';

//Utils
import IntegerTime from '@Utils/IntegerTime.js';
import IntegerTimeInterval from '@Utils/IntegerTimeInterval.js';

//Data imports
import {Record, Map, fromJS, List, Set as ImmutableSet} from 'immutable';
import {intRange} from '@Utils/Ranges.js';
import RehearsalSong from '@Models/RehearsalSong.js';

//Export again
export const SongEditStyles = EditStyles;

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
      
      //Base state
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
      this.handleTimeChange = this.handleTimeChange.bind(this);
      this.removeSong = this.removeSong.bind(this);
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

      let newState = {
        selectedSong: [],
        songIds: this.state.songIds.add(rehearsalSong.id),
        rehearsalSongs: this.state.rehearsalSongs.set(rehearsalSong.id, rehearsalSong)
      };

      this.setState(newState);
    }
    removeSong(e, props){
      this.setState({
        songIds: this.state.songIds.delete(props.songid),
        rehearsalSongs: this.state.rehearsalSongs.delete(props.songid)
      });
    }

    /**
     * Handles time change on a TimeSelector component
     * @param {integer} value 
     * @param {string} valueType
     * @param {object} props 
     */
    handleTimeChange(value, valueType, props){
      let type = props.type; //'start' or 'end', as specified on the components
      let id = props.songid;

      //Get the original time
      let time = this.state.rehearsalSongs.getIn([id,'rehearsalTime']).copy();
      const target = valueType == TimeParts.HOURS ? 'h' : 'm';
      //Update the time part
      time[type][target] = value;

      let timeRange = this.getTimeRange();
      //Clamp
      timeRange.clamp(time[type]);
      this.setState({
        rehearsalSongs: this.state.rehearsalSongs.setIn([id, 'rehearsalTime'], time)
      })
    }

    /**
     * Renders the form for a song. Adds the errors if present in <Alert> elements
     * @param {object} song The song to render.
     */
    renderSongForm(song, timeRange){
      return (
        <Row key={song.title} style={{paddingBottom:'5px',paddingTop:'5px'}}>
            <Col xs={1} md={1} style={pullBottomStyle}>
              <GlyphButton songid={song.id} glyph="remove" color="red" onClick={this.removeSong}></GlyphButton>
            </Col>
            <Col xs={3} md={3} style={pullBottomStyle}>
                    <h4>{song.title}</h4>
            </Col>
            <Col xs={7} md={7} style={pullBottomStyle}>
              <SongTimeSlider editStyle={this.props.editStyle} songTitle={song.title} timeRange={timeRange}
              onChange={this.updateSongRange} songid={song.id} value={song.rehearsalTime} step={5}/>
              {this.state.songErrs[song.id]? (<Alert bsStyle="danger">{this.state.songErrs[song.id]}</Alert>) : null}
            </Col>
          </Row>
      );
    }

    /**
     * Retrieves the time range as IntegerTimeInterval from the properties.
     */
    getTimeRange(){
      let start = this.props.startTime instanceof IntegerTime ? this.props.startTime: IntegerTime.fromArmyTime(this.props.startTime);
      let end = this.props.endTime instanceof IntegerTime ? this.props.endTime: IntegerTime.fromArmyTime(this.props.endTime);
      return new IntegerTimeInterval(start, end);
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
          //Check for intersection, ignore when start/end are the same
          if(songs.getIn([i,'rehearsalTime']).intersects(songs.getIn([j,'rehearsalTime']), true)){
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
      let availableSongs = Array.isArray(this.props.songs) ? new List(this.props.songs) : this.props.songs;

      //Remaining songs to select
      let songsLeft = availableSongs.filter((val)=>{
        return !this.state.songIds.contains(val.id);
      });

      //Active songs
      let songs = this.state.rehearsalSongs.valueSeq();

      //Start and end time
      let timeRange = this.getTimeRange();
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
              {songs.map((song)=>this.renderSongForm(song, timeRange))}
              <Row style={{paddingTop:'10px'}}>
                <Col xs={5} md={5}>
                  <Button bsStyle='success' onClick={this.onSave} style={{marginRight:'10px'}}>Opslaan</Button>
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
  onSave: PropTypes.func.isRequired,
  editStyle: PropTypes.oneOf([SongEditStyles.SLIDER, SongEditStyles.TEXTBOX]).isRequired
};