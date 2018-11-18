import React, { Component, PureComponent } from "react";
import DatePicker from '@Components/DatePicker.jsx';
import ConditionalComponent from '@Components/ConditionalComponent.jsx';
import PropTypes from 'prop-types';
import {Record, Map, fromJS} from 'immutable';
import {FormGroup,ControlLabel, Label, Panel, FormControl, Row, Col, Button,Glyphicon, ButtonGroup} from 'react-bootstrap';
import GlyphButton from '@Components/GlyphButton.jsx';

import InputRange from 'react-input-range';

import 'react-input-range/lib/css/index.css';

import {pullBottomStyle} from '@Components/UiHelpers.js';

import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {intRange} from '@Utils/Ranges.js';

function toHourMinute(int){
  const hours = Math.floor(int/100);
  return {
    h: hours,
    m: int - hours*100
  };
}

function minutesDiff(time1, time2){
  const t1 = toHourMinute(time1);
  const t2 = toHourMinute(time2);
  //1622 - 1358 = 180 + 24, -36
  const minuteDiff = t2.m - t1.m;
  const hourDiff = minuteDiff < 0 ? t2.h - t1.h + 1 : t2.h - t1.h;
  return minuteDiff + 60 * hourDiff;
}
function toHour(start, num, minuteSteps){
  const minuteNum = num * minuteSteps;
  const hours = Math.floor(minuteNum/60);
  return start + hours * 100 + minuteNum - hours*60;
}
function toVal(start, hourMinutes, minuteSteps){
  const diff = minutesDiff(start,hourMinutes);
  return diff / minuteSteps;
}

class ColorRanges extends PureComponent{
  render(){
    const valSpan = this.props.end - this.props.start;
    const defaultStyle = {
      position: 'absolute',
      display: 'inline-block',
      height:'5px',
      top:0
    };
    
    return(
      <div style={{position:'relative'}}>
        {
          this.props.ranges.map((range)=>{
            const left = 100*(range.start - this.props.start)/valSpan;
            const width = 100*(range.end-range.start)/valSpan;
            let styling = { left: left+'%', width:width+'%', ...defaultStyle};
            if('color' in range) styling.backgroundColor = range.color;
            const clsName = 'cls' in range ? range.cls : '';
            return(<span key={range.start} className={clsName} style={styling}/>);
          })
        }
      </div>
    );
  }
}
ColorRanges.propTypes = {
  ranges: PropTypes.array,
  start: PropTypes.number,
  end: PropTypes.number
};

class SongSlider extends PureComponent{
  constructor(props){
    super(props);
    this.onChange = this.onChange.bind(this);
    this.labelFunc = this.labelFunc.bind(this);
  }
  onChange(value){
    value.min = toHour(this.props.startTime, value.min, 5);
    value.max = toHour(this.props.startTime, value.max, 5);
    this.props.onChange(value, this.props);
  }
  labelFunc(value){
    const valueStr = toHour(this.props.startTime,value,5)+'';
    if(valueStr.length === 3){
      return '0'+valueStr[0]+':'+valueStr.slice(1,3);
    }
    return valueStr.slice(0,2) + ':' + valueStr.slice(2,4);
  }
  render(){
      let {songTitle, startTime, endTime, ...rest} = this.props;
      let range = minutesDiff(startTime,endTime)/5;
      let valObj = this.props.value;
      valObj.min = toVal(this.props.startTime,valObj.min,5);
      valObj.max = toVal(this.props.startTime,valObj.max,5);
      return (
          <Row {...rest} style={{paddingBottom:'5px',paddingTop:'5px'}}>
          <Col xs={3} md={3} style={pullBottomStyle}>
                  <h4>{songTitle}</h4>
          </Col>
          <Col xs={7} md={7} style={pullBottomStyle}>
                <InputRange 
                  minValue={0} maxValue={range} onChange={this.onChange}
                  value={valObj} formatLabel={this.labelFunc}/>
                <ColorRanges start={0} end={1} ranges={[{start:0.3,end:0.5, color:'red'},{start:0.6,end:0.8,color:'green'}]}/>
          </Col>
          </Row>
      );
    }
}
SongSlider.propTypes = {
  songTitle: PropTypes.string.isRequired,
  value : PropTypes.object.isRequired,
  onChange : PropTypes.func.isRequired,
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired
}

export default class RehearsalSongsForm extends Component{
    constructor(props){
      super(props);
      
      this.state = {
        selectedSong: [],
        songs: new Map(),
        songsLeft : new Set(props.songs)
      };
      
      //Bound callbacks
      this.updateSelectedSong = this.updateSelectedSong.bind(this);
      this.addRehearsalSong = this.addRehearsalSong.bind(this);
      this.updateSongRange = this.updateSongRange.bind(this);
    }
    updateSongRange(value, props){
      console.log("SONG: " + props.songid);
      console.log([parseInt(props.songid),'range']);
      let song = this.state.songs.get(props.songid);
      song.range = value;
      this.setState({
        songs: this.state.songs.set(props.songid,song)
      });
    }
    updateSelectedSong(value){
      this.setState({
        selectedSong: [value[0]]
      });
    }
    addRehearsalSong(){
      if(this.state.selectedSong.length === 0) return;
      
      let newSongsLeft = this.state.songsLeft;
      newSongsLeft.delete(this.state.selectedSong[0]);
      
      //Prepare song to be used with slider.
      let songObj = this.state.selectedSong[0];
      songObj.range = {min: this.props.startTime, max:this.props.endTime};
      
      let newState = {
        selectedSong: [],
        songsLeft: newSongsLeft,
        songs: this.state.songs.set(songObj.id, songObj),
      };
      this.setState(newState);
    }
    renderSongForm(song){
      return (
          <SongSlider key={song.title} songTitle={song.title} startTime={this.props.startTime} endTime={this.props.endTime}
            onChange={this.updateSongRange} songid={song.id} value={song.range} step={5}/>
      );
    }
    render(){
      console.log(this.state.songs);
      return (
        <React.Fragment>
          <Row>
          <Col xs={2}>
          <h3>Rooster</h3>
          </Col>
          <Col xs={3} style={pullBottomStyle}>
            <Label>Zoek een nummer</Label>
            <Typeahead options={Array.from(this.state.songsLeft)} selected={this.state.selectedSong} onChange={this.updateSelectedSong} labelKey="title"></Typeahead>
          </Col>
          <Col xs={3} style={pullBottomStyle}>
              <GlyphButton glyph="plus" color="green" onClick={this.addRehearsalSong}>Voeg toe</GlyphButton>
          </Col>
          </Row>
          <ConditionalComponent condition={this.state.songs.size > 0}>
          <Panel style={{marginTop:'10px',padding:'5px'}}>
          {this.state.songs.valueSeq().map((song)=>this.renderSongForm(song))}
          <Row>
          <Col xs={5} md={5}>
            <Button bsStyle='success'>Opslaan</Button>
            <Button bsStyle='danger'>Annuleren</Button>
          </Col>
          </Row>
          </Panel>
          </ConditionalComponent>
        </React.Fragment>
      );
    }
}
RehearsalSongsForm.propTypes = {
  songs : PropTypes.array.isRequired,
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired
};