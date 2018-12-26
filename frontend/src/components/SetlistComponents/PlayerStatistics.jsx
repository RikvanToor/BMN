import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SortableTable from '@Components/SortableTable.jsx';
import {Form, FormControl, FormGroup, ControlLabel, Checkbox} from 'react-bootstrap';
import {formatDuration} from '@Utils/DateTimeUtils.js';
import {unionIn} from '@Utils/SetUtils.js';
import HSLGradient from '@Utils/Color/HSLGradient.js';
import {SelectFormField} from '@Components/FormElement.jsx';

const ColorCols = {
  PlayTime: 0,
  
}

/**
 * Component displaying number of songs and playtime per player.
 * Sortable/Filterable on instrument and sortable on playtime/number of songs.
 */
export default class PlayerStatistics extends Component{
    constructor(props){
      super(props);
      this.state = {
        selectedInstrument: -1,
        colorColumns: new Set()
      };
      //Memoize
      this.instruments = new Set();
      //Setup gradient for coloring players according to playtime.
      this.gradient = new HSLGradient(0, 109, 65, 51);
      
      this.setFilter = this.setFilter.bind(this);
      this.setColorColumn = this.setColorColumn.bind(this);
    }
    setColorColumn(e){
      let id = e.target.id;
      let val = e.target.val;

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
        return (
            <tr key={playerStats.name}>
                <td>{playerStats.name}</td>
                <td>{Array.from(playerStats.instruments).join(', ')}</td>
                <td>{playerStats.songNum}</td>
                <td style={{backgroundColor:this.gradient.get(playerStats.playTime)}}>{formatDuration(playerStats.playTime)}</td>
            </tr>
        )
    }
    render(){
        let playerStats = this.props.playerStats ? this.props.playerStats : [];
        
        let span = playerStats.reduce((accum,val,i)=>{
          accum.min = Math.min(accum.min, val.playTime);
          accum.max = Math.max(accum.max, val.playTime);
          return accum;
        },{min:10000000,max:-1});
        this.gradient.setMinMax(span.min, span.max);       
        
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
                <Form inline>
                  <SelectFormField id="instrumentFilter" onChange={this.setFilter} label={"Toon instrumenten"} options={instrumentOptions}/>
                  <FormGroup>
                    <ControlLabel>Pas kleur toe op: </ControlLabel>
                    <Checkbox id="colorSongNum" inline>Aantal nummers</Checkbox> <Checkbox id="colorPlayTime" inline>Podiumtijd</Checkbox>
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