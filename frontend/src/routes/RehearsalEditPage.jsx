//React library imports
import React, { Component } from "react";
import PropTypes from 'prop-types';

//UI imports
import Carousel from "../components/carousel.jsx";
import ConditionalComponent from '@Components/ConditionalComponent.jsx';
import ConditionalComponet from '@Components/ConditionalComponent.jsx';
import { ButtonToolbar, ButtonGroup, Button, Glyphicon, Table, Checkbox, PageHeader, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import RehearsalForm from '@Components/RehearsalComponents/RehearsalForm.jsx';
import RehearsalSongsForm, {SongEditStyles} from '@Components/RehearsalComponents/RehearsalSongsForm.jsx';

//Data imports
import { Container } from 'flux/utils';
import UserStore from '@Stores/UserStore.js';
import { deferredDispatch, dispatch } from '@Services/AppDispatcher.js';
import RehearsalManipulationStore, { loadAllRehearsals } from '@Stores/RehearsalManipulationStore.js';
import RehearsalStore from '@Stores/RehearsalStore.js';
import SetlistStore from '@Stores/SetlistStore.js';
import { getScheduleAction, createRehearsals, deleteRehearsals, getAllAvailabilities, setRehearsalSongs } from '@Actions/RehearsalActions.js';
import {getSetlistSongs} from '@Actions/SetlistActions.js';
import {List} from 'immutable';

//Utils
import * as typeChecks from '@Utils/TypeChecks.js';
//Datetime formatting functions
import { readableDate, readableTime, IntegerTime } from '@Utils/DateTimeUtils.js';



/**
 * Page for editting rehearsals: creating new rehearsals and adding songs per rehearsal.
 */
class RehearsalEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      showRehearsalDayForm: false, 
      selectedRehearsalDays: new Set(), 
      editRehearsalInd: -1,
      songTimEditStyle :  SongEditStyles.TEXTBOX
    };

    //Bound callbacks
    this.hideRehearsalCreation = this.hideRehearsalCreation.bind(this);
    this.startRehearsalAdd = this.startRehearsalAdd.bind(this);
    this.saveNewRehearsals = this.saveNewRehearsals.bind(this);
    this.removeRehearsals = this.removeRehearsals.bind(this);
    this.stopEditRehearsal = this.stopEditRehearsal.bind(this);
    this.saveRehearsalSongs = this.saveRehearsalSongs.bind(this);
    this.editRehearsalSongs = this.editRehearsalSongs.bind(this);
    this.changeEditStyle = this.changeEditStyle.bind(this);
  }
  /**
   * Shows or hides the rehearsal creation form.
   * @param {boolean} visible 
   */
  toggleRehearsalForm(visible) {
    if (this.state.showRehearsalDayForm === visible) return;

    this.setState({
      showRehearsalDayForm: visible,
      editRehearsalInd: -1,
    });
  }
  /**
   * Trigger loads for data
   */
  componentDidMount() {
    //Load rehearsals  
    deferredDispatch(getScheduleAction());
    //Load user availabilities
    deferredDispatch(getAllAvailabilities());
    //Load setlist songs.
    deferredDispatch(getSetlistSongs());
  }
  /**
   * Deletes selected rehearsals.
   */
  removeRehearsals() {
    if (this.state.selectedRehearsalDays.size > 0) {
      dispatch(deleteRehearsals(Array.from(this.state.selectedRehearsalDays)));

      //Clear selection
      this.setState({ selectedRehearsalDays: new Set() });
    }
  }
  /**
   * 
   * @param {*} e 
   */
  startRehearsalAdd(e) {
    this.toggleRehearsalForm(true);
  }
  /**
   * Saves newly created rehearsals. Closes the rehearsal form
   * @param {List|array} rehearsals The rehearsals to create
   */
  saveNewRehearsals(rehearsals) {
    dispatch(createRehearsals(rehearsals));
    this.toggleRehearsalForm(false);
  }
  /**
   * Selects a rehearsal from the currently available rehearsals
   * @param {type} e The event triggered by the selection checkbox
   * @param {type} id The ID of the rehearsal to select
   */
  selectRehearsal(e, id) {
    let add = e.target.checked;
    let set = this.state.selectedRehearsalDays;
    if (add) {
      set.add(id);
    }
    else {
      set.delete(id);
    }
    this.setState({ selectedRehearsalDays: set });
  }

  hideRehearsalCreation() {
    this.toggleRehearsalForm(false);
  }
  stopEditRehearsal(){
    this.setState({editRehearsalInd: -1});
  }
  /**
   * 
   * @param {Map<int,RehearsalSong>} songs The map of songs to add to the rehearsal 
   */
  saveRehearsalSongs(songs){
    let rehearsal = this.props.rehearsals.get(this.state.editRehearsalInd);
    //Save the songs for the rehearsal
    dispatch(setRehearsalSongs(rehearsal,songs));
    this.setState({editRehearsalInd: -1});
  }
  editRehearsalSongs(ind){
    this.setState({editRehearsalInd: ind});
  }
  changeEditStyle(v){
    this.setState({songTimEditStyle: v});
  }

  /**
   * Renders a rehearsal row in the rehearsal table, including the songs time form if the
   * reheaersal is being editted.
   * @param {object} rehearsal The rehearsal object
   * @param {integer} ind Index of the rehearsal in the list 
   */
  renderRehearsal(rehearsal, ind){
    let songs = rehearsal.songs.map((el)=>{
      return {title: el.title, start: IntegerTime.fromDateString(el.pivot.start), end: IntegerTime.fromDateString(el.pivot.end)};
    }).sort((a,b)=>IntegerTime.compare(a.start,b.start));

    const hasSongs = 'songs' in rehearsal && rehearsal.songs.length > 0;
    const songText = hasSongs ? songs.map((el) =>{
      return (<p key={el.title}>{el.title} ({el.start.toReadableTime()} - {el.end.toReadableTime()}) </p>)
    }) : (<span>Nog geen</span>);
    
    const start = new Date(rehearsal.start);
    const end = new Date(rehearsal.end);

    return (
    <React.Fragment key={ind}>
    <tr>
      <td><Checkbox checked={this.state.selectedRehearsalDays.has(rehearsal.id)} onChange={(e) => this.selectRehearsal(e, rehearsal.id)} /></td>
      <td>{readableDate(start)}</td>
      <td>{rehearsal.location}</td>
      <td>{readableTime(start)} - {readableTime(end)}</td>
      <td>{songText}</td>
      <td><Button data-id={rehearsal.di} onClick={()=>this.editRehearsalSongs(ind)}>Bewerk rooster</Button></td>
    </tr>
    {
      this.state.editRehearsalInd == ind ? 
      (<tr>
      <td colSpan="6" style={{padding:'20px'}}>
        <RehearsalSongsForm songs={this.props.setlist} schedule={rehearsal.songs ? rehearsal.songs : []} 
          editStyle={this.state.songTimEditStyle}
          startTime={IntegerTime.fromDate(start)} 
          endTime={IntegerTime.fromDate(end)} 
          onCancel={this.stopEditRehearsal}
          onSave={this.saveRehearsalSongs} />
      </td>
      </tr>) :
      null
    }
    </React.Fragment>);
  }

  render() {
    return (
      <div>
        <PageHeader>Repetitiedagen</PageHeader>
        <ButtonToolbar>
          <ButtonGroup>
            <Button onClick={this.startRehearsalAdd}><Glyphicon glyph="plus" style={{ color: 'green', marginRight: '5px' }} />Nieuwe repetitiedag(en)</Button>
            <Button onClick={this.removeRehearsals}><Glyphicon glyph="minus" style={{ color: 'red' }} />Verwijder repetitiedag</Button>
          </ButtonGroup>
          <ToggleButtonGroup className="pull-right" type="radio" name="editstyle" value={this.state.songTimEditStyle} onChange={this.changeEditStyle}>
            <ToggleButton value={SongEditStyles.TEXTBOX}>Nummertijd als dropdown</ToggleButton>
            <ToggleButton value={SongEditStyles.SLIDER}>Nummertijd als slider</ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
        <ConditionalComponent condition={this.state.showRehearsalDayForm}>
          <RehearsalForm onCancel={this.hideRehearsalCreation} onSave={this.saveNewRehearsals} />
        </ConditionalComponent>
        <Table striped bordered condensed hover responsive style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Datum</th>
              <th>Locatie</th>
              <th>Tijd</th>
              <th>Nummers</th>
              <th>Acties</th>
            </tr>
          </thead>
          <tbody>
            {this.props.rehearsals.valueSeq().map((obj,ind) =>this.renderRehearsal(obj,ind))}
          </tbody>
        </Table>
      </div>
    );
  }
};

//Setup proptypes for development checking
RehearsalEditPage.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  reherasals: PropTypes.instanceOf(List)
};

//Wrap the page in a Flux container that relays data from stores
export default Container.createFunctional(
  (state) => (<RehearsalEditPage isAdmin={state.isAdmin} rehearsals={state.rehearsals} setlist={state.setlist} />), //View function

  () => [UserStore, RehearsalManipulationStore, RehearsalStore, SetlistStore], //Required stores

  (prevState) => { //Determine the state needed
    return { isAdmin: UserStore.user.isCommittee, rehearsals: RehearsalStore.rehearsals, setlist: SetlistStore.setlist };
  }
);