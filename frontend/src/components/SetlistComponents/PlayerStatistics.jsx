//UI
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SortableTable from '@Components/SortableTable.jsx';
import {Form, FormControl, FormGroup, ControlLabel, Checkbox, OverlayTrigger} from 'react-bootstrap';
import HSLGradient from '@Utils/Color/HSLGradient.js';
import {SelectFormField} from '@Components/FormElement.jsx';
import Tooltip from '@Components/Tooltip.jsx';

//Helper elements and functions
import {formatDuration} from '@Utils/DateTimeUtils.js';
import {unionIn} from '@Utils/SetUtils.js';
import {Set as ImmutableSet} from 'immutable';
import Interval from '@Utils/Interval.js'

const ColorCols = {
  PlayTime: 'PlayTime',
  SongNumber: 'SongNumber',
  CustomFunction: 'CustomFunction'
};

/**
 * Component displaying number of songs and playtime per player.
 * Sortable/Filterable on instrument and sortable on playtime/number of songs.
 */
export default class PlayerStatistics extends Component{
    constructor(props){
      super(props);
      this.state = {
        selectedInstrument: -1,
        colorColumns: new ImmutableSet()
      };
      //Memoize
      this.instruments = new Set();
      //Setup gradient for coloring players according to playtime.
      this.playerGradient = new HSLGradient(0, 109, 65, 51);
      this.songNumGradient = new HSLGradient(0, 109, 65, 51);
      
      this.setFilter = this.setFilter.bind(this);
      this.setColorColumn = this.setColorColumn.bind(this);
    }
    setColorColumn(e){
      let id = e.target.id;
      let val = e.target.checked;
      //Remove 'color-' prefix
      let type = id.substr(6);
      
      if(val) this.setState({colorColumns:this.state.colorColumns.add(ColorCols[type])});
      else this.setState({colorColumns:this.state.colorColumns.delete(ColorCols[type])});
    }
    /**
     * Set the filter to use
     * @param {SyntheticEvent} e Selection event of filter selector
     */
    setFilter(e){
      let value = e.target.value;
      if(value === '-1'){
        this.setState({selectedInstrument: -1});
      }
      else{
        this.setState({selectedInstrument: value});        
      }
    }
    renderPlayerRow(playerStats){
      let styles={songNum:{}, playTime:{}};
      if(this.state.colorColumns.has(ColorCols.PlayTime)){
        styles.playTime = {backgroundColor: this.playerGradient.get(playerStats.playTime)};
      }
      if(this.state.colorColumns.has(ColorCols.SongNumber)){
        styles.songNum = {backgroundColor: this.songNumGradient.get(playerStats.songNum)};
      }
      return (
          <tr key={playerStats.name}>
              <td>{playerStats.name}</td>
              <td>{Array.from(playerStats.instruments).join(', ')}</td>
              <td style={styles.songNum}>{playerStats.songNum}</td>
              <td style={styles.playTime}>{formatDuration(playerStats.playTime)}</td>
          </tr>
      )
    }
    render(){
        let playerStats = this.props.playerStats ? this.props.playerStats : [];
        
        let spans = {playTime: Interval.empty(), songNum: Interval.empty()};
        playerStats.forEach((stat)=>{
          spans.playTime.add(stat.playTime);
          spans.songNum.add(stat.songNum);
        });

        //Update the gradient ranges
        this.playerGradient.setMinMax(spans.playTime.min, spans.playTime.max);       
        this.songNumGradient.setMinMax(spans.songNum.min, spans.songNum.max);
        
        if(this.instruments.size === 0){
          playerStats.forEach((stat)=>{
            //Add to the instruments set the instruments of the player.
            this.instruments = unionIn(this.instruments, stat.instruments);
          });          
        }
        const songTableHeaders = ['Naam','Instrumenten', 'Aantal nummers','Podiumtijd'];
        const tableSorters = {0: 'name', 2:'songNum', 3:'playTime'};

        let filter = this.state.selectedInstrument !== -1 ? (el)=>el.instruments.has(this.state.selectedInstrument) : undefined;  

        //Options to filter on
        const instrumentOptions = [{value:-1,name:'Alle instrumenten'}].concat(
          Array.from(this.instruments).map((instr)=>{return{value:instr,name:instr};})
        );
        return (
            <React.Fragment>
              <div>
                <Form inline style={{marginBottom:"15px"}}>
                  <SelectFormField id="instrumentFilter" onChange={this.setFilter} label={"Toon instrumenten"} options={instrumentOptions}/>
                  <FormGroup>
                    <Tooltip placement="top" id="colorTooltip" tooltip={"Kleurt de cellen per deelnemer van hoogste(groen) naar laagste(rood)"}>
                      <ControlLabel>Pas kleur toe op: </ControlLabel>
                    </Tooltip>
                    <Checkbox id={"color-"+ColorCols.SongNumber} onChange={this.setColorColumn} inline>Aantal nummers</Checkbox>{' '}
                    <Checkbox id={"color-"+ColorCols.PlayTime} onChange={this.setColorColumn} inline>Podiumtijd</Checkbox>{' '}
                  </FormGroup>
                </Form>
              </div>
              <SortableTable striped bordered condensed hover responsive 
                  filter={filter} headers={songTableHeaders} data={playerStats} sorters={tableSorters}>
                  {playerStats.map((stats)=>this.renderPlayerRow(stats))}
              </SortableTable>
            </React.Fragment>
        );
    }
}

PlayerStatistics.propTypes = {
    colors: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
    playerStats : PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        songNum: PropTypes.number,
        playTime: PropTypes.number,
        instruments: PropTypes.instanceOf(Set)
    }))
};